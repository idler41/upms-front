FROM allinurl/goaccess
MAINTAINER idler41 idler41@163.com

ENV LANG=zh_CN \
    TZ=Asia/Shanghai

COPY goaccess.conf /srv/data/goaccess.conf
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone
