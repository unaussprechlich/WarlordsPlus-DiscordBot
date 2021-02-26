FROM node:lts-alpine as BUILD_TYPESCRIPT

COPY src .
COPY tsconfig.json .
COPY package.json .
COPY package-lock.json .

RUN npm install
RUN npm install typescript -g
RUN tsc

FROM node:lts-alpine

COPY package.json .
COPY package-lock.json .
COPY resources .
COPY LICENSE .

COPY --from=BUILD_TYPESCRIPT /.out .

RUN npm install --production

CMD ["node", "main.js"]
