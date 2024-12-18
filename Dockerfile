FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Set environment variables
ENV NODE_ENV=production

# Service account will be mounted by Cloud Run
ENV GOOGLE_APPLICATION_CREDENTIALS=/secrets/service-account.json

# Expose the port
EXPOSE 8080

# Start the server
CMD [ "npm", "start" ]