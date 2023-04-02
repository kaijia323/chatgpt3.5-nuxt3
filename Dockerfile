FROM node:18.10.0

WORKDIR /root/chatgpt

COPY ./.output /root/chatgpt/.output
# COPY ./package.json /root/chatgpt/package.json
COPY ./ecosystem.config.js /root/chatgpt/ecosystem.config.js

# RUN npm i pm2 -g
RUN yarn global add pm2 -g

EXPOSE 8472

# CMD [ "npm run pm2:start" ]
# ENTRYPOINT [ "npm run pm2:start" ]