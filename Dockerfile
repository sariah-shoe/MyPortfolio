# ---------- Build frontend ----------
FROM node:22-alpine AS frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# ---------- Backend ----------
FROM node:22-alpine
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --production

COPY server ./server
COPY --from=frontend /app/client/dist ./server/public

WORKDIR /app/server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]