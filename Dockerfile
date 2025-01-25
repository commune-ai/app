# Start from an official Node image with version >=16 (e.g., 18 or LTS)
FROM node:18

# Set the DEBIAN_FRONTEND to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Update and install OS-level packages
RUN apt-get update && \
    apt-get install -y nano build-essential cargo libstd-rust-dev python3 python3-pip python3-venv git

# Install pm2 globally
RUN npm install -g pm2

# Show Python version (just for logging)
RUN python3 --version

# Clone and install commune
RUN git clone -b main --single-branch https://github.com/commune-ai/commune.git /commune
RUN pip install -e /commune --break-system-packages

# Copy package.json and install dependencies
WORKDIR /app
COPY ./app/package.json .
RUN yarn install
COPY . .
# RUN chmod +x .run/*
ENTRYPOINT [ "bash", "-c", "./run/entry.sh" ]


