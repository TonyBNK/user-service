# Use the official Node.js image as the base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy configuration files
COPY package.json tsconfig.json nest-cli.json /app/

# Install dependencies
RUN npm install

# Copy the code source
COPY src /app/src

# Build the NestJS application
RUN npm run build

# Start the NestJS application
CMD ["npm", "start"]
