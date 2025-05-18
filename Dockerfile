# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Run the development server
CMD ["npm", "run", "dev"]