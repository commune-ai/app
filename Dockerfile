# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    # python3 \
    # python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and NPM
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn


# include yarnlock file if it exists
COPY package.json ./
RUN yarn install

# Verify installations
RUN python3 --version && \
    npm --version && \
    yarn --version

# Set working directory
WORKDIR /app