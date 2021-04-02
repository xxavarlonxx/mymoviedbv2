FROM node:12-alpine as ui-builder
WORKDIR /usr/src/app
COPY client/package*.json ./
RUN npm install --quiet
COPY client/ ./
RUN npm run build

FROM node:12 as server-builder
WORKDIR /usr/src/app
COPY --from=ui-builder /usr/src/app/dist ./public
COPY server/package*.json ./
RUN npm install --quiet
COPY server/ ./
RUN npm install -g @adonisjs/cli
