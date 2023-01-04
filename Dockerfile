FROM node:17.3

# Create directory named app to hold the application code inside the image
WORKDIR /app

# Add package.json and package-lock.json
COPY package*.json /tmp/

# Install dependencies
RUN cd /tmp && npm install

# Move installed node modules to app
RUN cp -a /tmp/node_modules /app

# Bundle app source
COPY . /app

RUN npm run build

ENV NODE_ENV=local

CMD ["npm", "run", "start:prod"]