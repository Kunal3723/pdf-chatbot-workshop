FROM node:lts-bookworm-slim

WORKDIR /user/nodeapp

# COPY package.json ./
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]