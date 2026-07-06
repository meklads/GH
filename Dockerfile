FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-redirects.conf /etc/nginx/conf.d/redirects.conf
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
