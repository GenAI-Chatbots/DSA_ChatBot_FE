# Dockerfile for a bot frontend
# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY package.json ./
COPY . .

# Install dependencies
RUN npm install

# Build the Vite app
RUN npm run build

# Install a lightweight static server
RUN npm install -g serve

# Serve the build folder
CMD ["serve", "-s", "dist", "-l", "5173"]