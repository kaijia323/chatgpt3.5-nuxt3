import openaiChat from "~~/utils/openaiChat";

export default defineEventHandler(async event => {
  const body = await readBody(event);
  return openaiChat(body.content);
});
