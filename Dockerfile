# =========================
# Build React Frontend
# =========================
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# =========================
# Build Backend
# =========================
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# =========================
# Final Image
# =========================
FROM node:18

WORKDIR /app

# copy backend
COPY --from=backend-build /app/backend ./backend

# copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# install serve for frontend
RUN npm install -g serve

EXPOSE 5000
EXPOSE 3000

CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/build -l 3000"]
