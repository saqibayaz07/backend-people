

# Use the official Node.js image as the base image (LTS version for stability)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json first to leverage Docker's caching
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Set environment variables (use a .env file for sensitive data)
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8005

# Run the application
CMD ["npm", "start"]
