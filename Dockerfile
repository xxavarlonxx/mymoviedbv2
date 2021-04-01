FROM node:12-alpine as ui-builder
WORKDIR /usr/src/app
COPY client/package*.json ./
RUN npm install --silent
COPY client/ ./

FROM node:12-alpine as server-builder
WORKDIR /usr/src/app
COPY --from=ui-builder /usr/src/app/dist ./public
COPY server/package*.json ./
RUN npm install --silent
COPY server/ ./
RUN npm run start

