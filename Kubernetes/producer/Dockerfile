FROM node:carbon-alpine
CMD ['npm','start']
WORKDIR /app
EXPOSE 80
COPY package*.json ./
RUN npm install
COPY . .
