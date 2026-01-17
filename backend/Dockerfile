FROM node:18

WORKDIR /app

# Backend
COPY backend/package*.json backend/
RUN cd backend && npm install

# Frontend
COPY frontend/package*.json frontend/
RUN cd frontend && npm install && npm run build

# Copy source
COPY backend backend
COPY frontend/build frontend/build

EXPOSE 10000

CMD ["node", "backend/src/index.js"]
