# This is a builder image for the project. Feel free to use it, but it's
# not an actual working environment meant for production, it's for releases
# and certain automations.
FROM node:22-alpine3.19
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
WORKDIR /app
# Install dependencies
RUN apk update && apk add --no-cache ca-certificates git bash openjdk11-jre jq openssh python3 && rm -rf /var/cache/apk/*
COPY . .
# Pre-cache node modules, set up ssh, install gh, and install gcloud
RUN yarn install && \
    mv node_modules /tmp/ && \
    cd / && \
    rm -rf /app && \
    mkdir /app && \
    mv /tmp/node_modules /app/ && \
    cd /app && \
    mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh && \
    ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts && \
    wget https://github.com/cli/cli/releases/download/v2.54.0/gh_2.54.0_linux_amd64.tar.gz && \
    tar -xvf gh_2.54.0_linux_amd64.tar.gz && \
    cd gh_2.54.0_linux_amd64 && \
    mv bin/gh /usr/local/bin/ && \
    cd /app && \
    rm -rf gh_2.54.0_linux_amd64 && \
    rm gh_2.54.0_linux_amd64.tar.gz && \
    chmod +x /usr/local/bin/gh && \
    wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz && \
    tar -xvf google-cloud-cli-linux-x86_64.tar.gz && \
    rm -f google-cloud-cli-linux-x86_64.tar.gz && \
    mv google-cloud-sdk /usr/local/ && \
    /usr/local/google-cloud-sdk/install.sh --quiet

ENV PATH="/usr/local/google-cloud-sdk/bin:${PATH}"
