FROM node

WORKDIR /app

RUN apt-get update && apt-get upgrade -y
RUN npm cache clean --force
RUN npm install npm -g
RUN npm install nodemon -g
RUN npm init react-app .

COPY ./code /app/src

EXPOSE 3000
CMD [ "nodemon", "react-scripts", "start" ]