# Use a lightweight Node.js base image
FROM node:22.11.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install --legacy-peer-deps

# Copy the entire source code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the application's port
EXPOSE 4000

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
