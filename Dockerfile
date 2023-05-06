FROM node:latest

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

EXPOSE 8080

# Run the compiled JavaScript code
CMD [ "node", "dist/index.js" ]