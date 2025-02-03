# Start from an official Node image with version >=16 (e.g., 18 or LTS)
FROM node:18
# Set the DEBIAN_FRONTEND to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# RUST installation
RUN apt-get update && apt-get install -y nano build-essential cargo libstd-rust-dev git

# PYTHON
RUN apt-get install -y python3 python3-pip python3-venv
RUN python3 --version
# install commune
RUN npm install -g pm2
RUN git clone -b main --single-branch https://github.com/commune-ai/commune.git /commune
RUN pip install -e /commune --break-system-packages

# Copy package.json and install dependencies
WORKDIR /app
COPY ./app/package.json .
RUN yarn install
COPY . .
RUN chmod +x run/*

ENTRYPOINT [ "bash", "-c", "./run/app.sh" ]


