# ======= Stage 1: Build React App =======
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app (React builds to /app/build)
RUN npm run build


# ======= Stage 2: Serve with Nginx =======
FROM nginx:alpine

# Copy custom Nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Set correct permissions (optional, for logging/writing if needed)
# Nginx user already exists; no need to recreate
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Use non-root user already defined in nginx image
USER nginx

# Expose port 80 (React is typically served on port 80)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
