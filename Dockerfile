FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 9000/tcp