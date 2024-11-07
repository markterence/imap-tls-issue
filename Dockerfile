FROM node:18.15-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json /app/.
RUN yarn install --frozen-lockfile
COPY . /app/

RUN ["node", "index.js"]