# Build static site in CI/Coolify, then serve with nginx
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-redirects.conf /etc/nginx/snippets/gh-redirects.conf
COPY --from=builder /app /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/node_modules \
    /usr/share/nginx/html/scripts \
    /usr/share/nginx/html/src \
    /usr/share/nginx/html/package.json \
    /usr/share/nginx/html/package-lock.json \
    /usr/share/nginx/html/tailwind.config.js \
    /usr/share/nginx/html/.cursor \
    /usr/share/nginx/html/workers
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
