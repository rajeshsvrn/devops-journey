FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN addgroup -g 1001 -S nginx && adduser -S nginx -u 1001 -G nginx
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]