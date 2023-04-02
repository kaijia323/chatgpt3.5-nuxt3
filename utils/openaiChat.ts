import { Configuration, OpenAIApi } from "openai";
import * as tunnel from "tunnel";
import { useRuntimeConfig } from "#imports";
import initEnv from "./initEnv";

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

const openaiChat = async (prompt: string) => {
  try {
    const completion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        ...agentOptions,
      }
    );
    return {
      message: completion.data.choices[0].message?.content,
    };
  } catch (err) {
    const error = err as any;
    if (error.response) {
      return {
        ...error.response,
      };
    }

    // return error;
    throw "error";
  }
};

export default openaiChat;
