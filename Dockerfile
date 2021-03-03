FROM node:lts-alpine as BUILD_TYPESCRIPT

COPY src /src
COPY tsconfig.json .
COPY package.json .
COPY package-lock.json .

RUN npm install typescript -g

RUN npm install

RUN tsc

FROM node:lts-alpine

COPY package.json .
COPY package-lock.json .
COPY src/resources .
COPY LICENSE .

COPY --from=BUILD_TYPESCRIPT /.out .

RUN npm install --production

CMD ["node", "main.js"]
