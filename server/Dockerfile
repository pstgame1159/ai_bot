FROM node:21

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install express

COPY ./index.js ./
COPY ./controllers ./controllers
COPY ./routes ./routes

EXPOSE 3002

CMD ["node", "index.js"]
