# FROM node:22.4
FROM node:lts-bookworm-slim

WORKDIR /user/nodeapp

COPY package.json ./

RUN npm install
RUN npm install @anush008/tokenizers

COPY . .

EXPOSE 3000

CMD [ "node", "./src/index.js" ]
