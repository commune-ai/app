
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application

# Build and start the Next.js app
CMD ["npm", "run", "dev", "--", "-p", "3000"]
