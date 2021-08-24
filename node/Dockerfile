FROM node:latest
RUN mkdir /node
WORKDIR /node
RUN apt-get update
RUN apt-get -y install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0 libgbm-dev
#ADD package.json /node/package.json
#RUN npm install
#RUN npm install cron
