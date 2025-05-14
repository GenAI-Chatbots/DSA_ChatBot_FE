# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# Expose the default Vite preview port
EXPOSE 4173

# Serve the built app using Vite preview
CMD ["npm", "run", "preview"]