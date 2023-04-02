# 通过 docker 使用，需要在服务器自行准备代理(clash 或其他)

```shell
# 拉取仓库
# git clone git@github.com:kaijia323/chatgpt3.5-nuxt3.git
git clone https://github.com/kaijia323/chatgpt3.5-nuxt3.git
# 下载依赖
npm i
# 打包
npm run build
# 通过 docker-compose 运行
docker-compose up -d
# 浏览器打开
localhost:8472
```

# 配置

- 需要在当前项目创建 `config.json` 文件，自行准备代理
  ```json
  {
    "apiKey": "openai的key",
    "proxy": {
      "host": "127.0.0.1",
      "port": 7890
    }
  }
  ```

# 本地运行

```shell
# 拉取仓库
# git clone git@github.com:kaijia323/chatgpt3.5-nuxt3.git
git clone https://github.com/kaijia323/chatgpt3.5-nuxt3.git
# 下载依赖
npm i
# 项目根路径创建 config.json 如上的配置
# 运行项目 需要本地准备代理 (clash客户端即可或其他)
npm run dev
```
