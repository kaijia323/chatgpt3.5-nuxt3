import { Configuration, OpenAIApi } from "openai";
import * as tunnel from "tunnel";
import { useRuntimeConfig } from "#imports";
import initEnv from "./initEnv";

interface IBody {
  id: string;
  prompt: string;
}

const { apiKey, proxy } = initEnv();

const configuration = new Configuration({
  apiKey,
});

const runtimeConfig = useRuntimeConfig();

const openai = new OpenAIApi(configuration);

let agentOptions: undefined | Record<string, any> = undefined;
if (runtimeConfig.env === "development" && proxy) {
  const tunnelingAgent = tunnel.httpsOverHttp({
    proxy,
  });

  agentOptions = {
    httpAgent: tunnelingAgent,
    httpsAgent: tunnelingAgent,
    proxy: false,
  };
}

const openaiChat = (body: IBody, res: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const completion = await openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: body.prompt,
            },
          ],
          stream: true,
        },
        {
          ...agentOptions,
          responseType: "stream",
        }
      );
      (completion.data as any).on("data", (data: any) => {
        const lines = data
          .toString()
          .split("\n")
          .filter((line: any) => line.trim() !== "");
        for (const line of lines) {
          const message = line.toString().replace(/^data: /, "");
          if (message === "[DONE]") {
            res.write("event: done\n");
            res.write(`id: ${body.id}\n`);
            res.write("data: [DONE]\n\n");
            resolve("");
            return; // Stream finished
          }
          try {
            const parsed = JSON.parse(message);
            // console.log(parsed.choices[0].text);
            // console.log(parsed.choices[0].delta.content);
            const content = parsed.choices[0].delta.content;
            if (content) {
              res.write("event: chatgpt\n");
              res.write(`id: ${body.id}\n`);
              res.write(`data: ${JSON.stringify(content)}\n\n`);
            }
          } catch (error) {
            console.error(
              "Could not JSON parse stream message",
              message,
              error
            );
            reject();
          }
        }
      });
    } catch (err) {
      const error = err as any;
      if (error.response) {
        return error.response;
      }

      reject(err);
      return error;
      // throw "error";
    }
  });
};

export default openaiChat;
