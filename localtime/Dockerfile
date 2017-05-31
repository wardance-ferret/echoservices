FROM node:6.10

EXPOSE 3003 

RUN apt-get update && \
    apt-get install -y sudo && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN adduser --disabled-password --gecos '' --uid 1000 docker && \
  adduser docker sudo && \
  echo 'docker ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  chown -R docker:docker /app
USER docker
RUN npm install -g --unsafe-perm strongloop 
ENTRYPOINT ["node", "."]
