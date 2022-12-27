#FROM node:latest
FROM ghcr.io/puppeteer/puppeteer:latest
RUN mkdir /home/pptruser/node
WORKDIR /home/pptruser/node
ADD package.json /home/pptruser/node/package.json
RUN npm install
COPY . .
CMD node bienici.js
