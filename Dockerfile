FROM idler41/nginx-cn:1.0
MAINTAINER idler41 idler41@163.com

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
