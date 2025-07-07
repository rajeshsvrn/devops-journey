# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app
COPY . .

# Build React app
RUN npm run build

# Stage 2: Serve it with Nginx
FROM nginx:alpine

# Remove default nginx index
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
