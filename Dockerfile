FROM golang:alpine

RUN apk add --no-cache nodejs yarn
RUN apk add --no-cache openjdk8
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"
RUN apk add --no-cache python3

WORKDIR /usr/src/app

COPY ./package.json ./

COPY ./routes .

EXPOSE 8080

CMD [ "node", "app.js" ]