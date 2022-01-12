FROM node:alpine
ARG        OCAML_MAJOR=4.07
ARG        OCAML_VERSION=4.07.1
ARG        OPAM_VERSION=2.1.2


WORKDIR /usr/src/app

# Add Python 3 
RUN apk add --no-cache python3

# Add C compiler
RUN apk add --update make


RUN apk --no-cache add \
      build-base \
      wget \
      openssl \
      ca-certificates \
      bash \
      m4 \
      git \
      rsync \
      mercurial \
      patch \
      perl \
      aspcud
RUN wget http://caml.inria.fr/pub/distrib/ocaml-${OCAML_MAJOR}/ocaml-${OCAML_VERSION}.tar.gz && \
    tar xzf ocaml-${OCAML_VERSION}.tar.gz && \
    cd ocaml-${OCAML_VERSION} && \
    ./configure && make world.opt && umask 022 && make install && make clean && \
    cd .. && \
    rm -f ocaml-${OCAML_VERSION}.tar.gz && \
    rm -rf ocaml-${OCAML_VERSION} && \
    wget https://github.com/ocaml/opam/releases/download/${OPAM_VERSION}/opam-full-${OPAM_VERSION}.tar.gz && \
    tar zxf opam-full-${OPAM_VERSION}.tar.gz && \
    cd opam-full-${OPAM_VERSION} && \
    ./configure && make lib-ext && make && make install && \
    cd .. && \
    rm -f opam-full-${OPAM_VERSION}.tar.gz && \
    rm -rf opam-full-${OPAM_VERSION} && \
    yes | opam init && \
    eval `opam config env` && \
    yes | opam install utop

COPY package*.json ./

RUN npm i


COPY . .

EXPOSE 3000 
CMD [ "npm", "start" ]