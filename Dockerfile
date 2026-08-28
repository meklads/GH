# Serve the pre-built static site with nginx.
# HTML/assets are committed from local `npm run build` — avoid re-running the full
# Node pipeline on Coolify (OOM / timeouts on Docker 29 BuildKit hosts).
FROM public.ecr.aws/docker/library/nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-redirects.conf /etc/nginx/snippets/gh-redirects.conf
COPY . /usr/share/nginx/html

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
    /usr/share/nginx/html/.trash \
    /usr/share/nginx/html/.git \
    /usr/share/nginx/html/partials

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
