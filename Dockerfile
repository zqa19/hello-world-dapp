FROM eris/decerver:latest
MAINTAINER Eris Industries <support@erisindustries.com>

USER root

COPY . /home/$user/.decerver/source
RUN chown --recursive $user /home/$user

USER $user

EXPOSE 50505
VOLUME /home/$user/.decerver
CMD /home/$user/.decerver/source/cmd.sh
