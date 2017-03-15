FROM node:boron

# Create app directory
RUN mkdir -p /rabbitmq
WORKDIR /rabbitmq

# Install app dependencies
COPY package.json /rabbitmq/
RUN npm install

# Bundle app source
COPY . /rabbitmq

EXPOSE 8080
CMD [ "npm", "start" ]
