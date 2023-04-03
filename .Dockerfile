FROM node:16-bullseye-slim

RUN apt update
RUN apt install -y git
RUN apt install -y curl
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
RUN echo 'export PATH=${HOME}/.linuxbrew/bin:$PATH' >> .bash_profile
RUN brew install mecab
RUN brew install mecab-ipadic

WORKDIR /opt
RUN git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
WORKDIR /opt/mecab-ipadic-neologd
RUN ./bin/install-mecab-ipadic-neologd -n -y

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

CMD [ "npx ts-node", "./index.ts" ]
