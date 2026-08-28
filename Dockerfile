# Build static site in CI/Coolify, then serve with nginx
# Use AWS Public ECR mirror — avoids Docker Hub rate limits / metadata timeouts on self-hosted Coolify
FROM public.ecr.aws/docker/library/node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends libwebp-dev webp fontconfig fonts-noto-core fonts-noto-arabic \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund \
  || npm ci --prefer-offline --no-audit --no-fund
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV CI=true
RUN npm run build

FROM public.ecr.aws/docker/library/nginx:1.27-alpine
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
    /usr/share/nginx/html/workers \
    /usr/share/nginx/html/.github \
    /usr/share/nginx/html/docs \
    /usr/share/nginx/html/.trash
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
