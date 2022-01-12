FROM node:alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]