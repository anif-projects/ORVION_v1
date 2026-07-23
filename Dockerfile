# Multi-stage Dockerfile for LMS Backend & Frontend

# Stage 1: Build Frontend Assets
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server Environment
FROM node:18-alpine AS production
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

COPY server/ ./server/
COPY --from=frontend-builder /app/frontend/dist ./server/public

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server/server.js"]
