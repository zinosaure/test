FROM node

WORKDIR /app

RUN apt-get update && apt-get upgrade -y
RUN npm cache clean --force
RUN npm install npm -g
RUN npm install nodemon -g
RUN npm install express
RUN npm install express cors
RUN npm install better-sqlite3

COPY ./code /app/code
WORKDIR /app/code

EXPOSE 80
CMD [ "nodemon", "server.js" ]