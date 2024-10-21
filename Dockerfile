# Use Node.js 20 as the base image
FROM node:20

# Set the working directory for backend
WORKDIR /app/backend

# Copy the backend package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Set the working directory for frontend
WORKDIR /app/client

# Copy the frontend package.json and package-lock.json
COPY client/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy all the backend and frontend source code into the container
COPY backend /app/backend
COPY client /app/client

# Build the frontend
WORKDIR /app/client
RUN npm run build

# Move the build files to the backend's public directory
RUN mkdir -p /app/backend/public
RUN cp -r build/* /app/backend/public/

# Expose the backend port (e.g., 5000)
EXPOSE 5000

# Set the working directory to the backend
WORKDIR /app/backend

# Start the backend server
CMD ["npm", "start"]
