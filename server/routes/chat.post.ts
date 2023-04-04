import openaiChat from "~~/utils/openaiChat";

export default fromNodeMiddleware((req, res, __) => {
  let body = "";
  req.on("data", d => {
    body += d;
  });
  req.on("end", async () => {
    const p = JSON.parse(body);
    res.setHeader("Content-Type", "text/event-stream");
    await openaiChat(p, res);
    res.end();
  });
});
