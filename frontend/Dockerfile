# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the Next.js app
FROM node:18-alpine

WORKDIR /app

# Copy only needed files from builder
COPY --from=builder /app ./

# Set environment to production
ENV NODE_ENV=production

# Expose Next.js default port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
