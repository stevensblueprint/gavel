FROM node:alpine

WORKDIR /usr/src/app

RUN apk add --no-cache bash make valgrind gcc g++ python3

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000 
CMD [ "npm", "start" ]