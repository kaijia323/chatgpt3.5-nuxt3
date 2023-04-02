FROM node:18.15.0

WORKDIR /root

COPY ./.output /root/chatgpt/.output
# COPY ./package.json /root/chatgpt/package.json
COPY ./ecosystem.config.js /root/chatgpt/ecosystem.config.js
# VOLUME [ "/root/chatgpt" ]
# RUN yarn config set registry https://registry.yarnpkg.com
# RUN yarn config set registry https://registry.npmmirror.com
RUN npm i pm2 -g
# RUN yarn global add pm2 -g

EXPOSE 8472

ENTRYPOINT [ "pm2-runtime start /root/chatgpt/ecosystem.config.js" ]