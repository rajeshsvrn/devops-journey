# # Build stage
# FROM node:18-alpine as build

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Nginx stage
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]



# Build stage
FROM node:18-alpine as build

WORKDIR /app
# Copy package.json (which includes jaeger-client, express, etc.)
COPY package*.json ./
# Installs ALL dependencies (including express, jaeger-client, etc.)
RUN npm install
# Copy the rest of the app and build
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]