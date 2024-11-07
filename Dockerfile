FROM node:18.15-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json /app/.
COPY . /app/
RUN yarn install
