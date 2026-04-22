# Tahap 1: Build Frontend TypeScript
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# Membuat folder public/uploads di dalam wadah jika belum ada
RUN mkdir -p public/uploads
RUN npx prisma generate
RUN npm run build


# Tahap 2: Setup Production Server
FROM node:18-alpine AS runner

WORKDIR /app
COPY package*.json ./
# Hanya install dependensi produksi untuk efisiensi ukuran
RUN npm ci --only=production

# Copy hanya yang diperlukan dari tahap builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Mount .env secara manual nanti atau inject via variabel env di VPS Server

EXPOSE 3000
CMD ["npm", "start"]
