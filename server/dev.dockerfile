FROM node:11
WORKDIR /usr/src/app
RUN npm install -g nodemon
RUN npm install -g @adonisjs/cli
COPY package*.json ./
RUN npm install
