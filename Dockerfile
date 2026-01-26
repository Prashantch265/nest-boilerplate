# Stage 1: Build the application using Debian bullseye
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Add package.json and package-lock.json
COPY package*.json /tmp/

# Install all dependencies
RUN cd /tmp && npm install

# Move installed node modules to app
RUN cp -a /tmp/node_modules /app

# Copy the rest of the application files
COPY . /app

# Build the NestJS application
RUN npm run build

# Reduce installed packages to production-only.
RUN npm prune --production

# Stage 2: Create the production image using bullseye-lts (no vulnerabilities)
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/views /app/views
COPY --from=builder /app/package.json /app/package.json

# Expose the port on which the app will run
EXPOSE 5000

# Start the application
CMD ["node", "dist/main"]