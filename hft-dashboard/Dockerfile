FROM node:20-alpine

WORKDIR /app

# Copy dependency graphs
COPY package.json package-lock.json ./

# Install dependencies securely
RUN npm ci

# Copy full source and build the static output
COPY . .
RUN npm run build

# Expose Dashboard UI port
EXPOSE 3000

# Start Next.js production server
CMD ["npm", "start"]
