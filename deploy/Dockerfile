FROM ubuntu:24.04

ARG WALRUS_VERSION=mainnet-latest
ARG SITE_BUILDER_VERSION=mainnet-latest

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates openssh-server nano \
    && rm -rf /var/lib/apt/lists/*

# Download Walrus CLI
RUN curl -sSL "https://storage.googleapis.com/mysten-walrus-binaries/walrus-${WALRUS_VERSION}-ubuntu-x86_64" -o /usr/local/bin/walrus \
    && chmod +x /usr/local/bin/walrus

# Download site-builder
RUN curl -sSL "https://storage.googleapis.com/mysten-walrus-binaries/site-builder-${SITE_BUILDER_VERSION}-ubuntu-x86_64" -o /usr/local/bin/site-builder \
    && chmod +x /usr/local/bin/site-builder

# Download Sui CLI
RUN curl -sSL "https://github.com/MystenLabs/sui/releases/latest/download/sui-ubuntu-x86_64" -o /usr/local/bin/sui \
    && chmod +x /usr/local/bin/sui

# Setup SSH
RUN mkdir /var/run/sshd \
    && echo 'root:deploy' | chpasswd \
    && sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config \
    && sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Walrus sites config for mainnet
RUN mkdir -p /root/.config/walrus
COPY sites-config.yaml /root/.config/walrus/sites-config.yaml

# Working directory for the site
WORKDIR /site

# Entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 22

ENTRYPOINT ["/entrypoint.sh"]
