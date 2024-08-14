# This is a builder image for the project. Feel free to use it, but it's
# not an actual working environment meant for production, it's for releases.
FROM node:22-alpine3.19
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
WORKDIR /app
RUN apk update && apk add --no-cache ca-certificates git bash openjdk11-jre && rm -rf /var/cache/apk/*
COPY . .
RUN yarn install && mv node_modules /tmp/ && cd / && rm -rf /app && mkdir /app && mv /tmp/node_modules /app/
