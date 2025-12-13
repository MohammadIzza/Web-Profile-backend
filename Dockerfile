FROM oven/bun:1

WORKDIR /app

# Prisma sering butuh openssl
RUN apt-get update && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency + prisma dulu biar cache bagus
COPY package.json bun.lock* ./
COPY prisma ./prisma

RUN bun install

# Copy source
COPY . .

# Generate prisma client
RUN bunx prisma generate

# (Optional) informasi saja, tidak wajib
EXPOSE 8000

# Jalankan migrate saat container start
CMD ["sh", "-lc", "bunx prisma migrate deploy && bun run start"]
