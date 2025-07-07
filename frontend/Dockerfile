# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from React build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port (80 is standard for Nginx)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
