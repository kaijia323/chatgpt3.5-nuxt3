module.exports = {
  apps: [
    {
      name: "chatgpt3.5-nuxt3",
      port: "8472",
      exec_mode: "cluster",
      instances: "1",
      script: "./.output/server/index.mjs",
    },
  ],
};
