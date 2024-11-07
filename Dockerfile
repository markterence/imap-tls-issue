FROM node:18.15-alpine
RUN yarn set version stable
RUN mkdir /app
WORKDIR /app
COPY package.json /app/.
RUN yarn install
COPY . /app/

RUN ["node", "index.js"]