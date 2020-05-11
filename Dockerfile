FROM node:12.16.1

# Create App Directory
RUN mkdir -p /usr/src/devcamper-api
WORKDIR /usr/src/devcamper-api

# Install dependencies
COPY package.json /usr/src/devcamper-api
RUN npm install

# Copy app source files
COPY . /usr/src/devcamper-api

# Build Argumens
ARG NODE_VERSION=12.16.1

# Build Environment
ENV NODE_VERSION=${NODE_VERSION}

CMD [ "/bin/bash" ]