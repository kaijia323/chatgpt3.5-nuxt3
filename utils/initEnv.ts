import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

interface IEnvConfig {
  apiKey: string;
  proxy?: {
    host: string;
    port: number;
  };
}

const __dirname = resolve();

const envConfigPath = resolve(__dirname, "config.json");

const initEnv = (): IEnvConfig => {
  let c;
  if (existsSync(envConfigPath)) {
    c = JSON.parse(readFileSync(envConfigPath).toString());
  }
  /**
   * httpProxy = http://127.0.0.1:7890
   */
  const { httpProxy, apiKey } = process.env;
  const url = httpProxy ? new URL(httpProxy) : "";
  return {
    apiKey: c?.apiKey || apiKey,
    proxy:
      c?.proxy ||
      (url && {
        host: url.hostname,
        port: parseInt(url.port),
      }) ||
      undefined,
  };
};

export default initEnv;
