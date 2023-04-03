FROM node:16-bullseye-slim

RUN apt update
RUN apt install -y build-essential
RUN apt install -y file
RUN apt install -y git
RUN apt install -y curl
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
ENV PATH=$PATH:/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin/
ENV MANPATH="$MANPATH:/home/linuxbrew/.linuxbrew/share/man"
ENV INFOPATH="$INFOPATH:/home/linuxbrew/.linuxbrew/share/info"
ENV HOMEBREW_NO_AUTO_UPDATE=1

RUN brew install mecab
RUN brew install mecab-ipadic

WORKDIR /opt
RUN git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
WORKDIR /opt/mecab-ipadic-neologd
RUN ./bin/install-mecab-ipadic-neologd -n -y

WORKDIR /usr/src/app

ENV PORT 8080

COPY package*.json ./

RUN npm install --only=production

COPY . ./

RUN npm run build
CMD [ "npm", "start" ]
