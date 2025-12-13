FROM oven/bun:1

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock* ./
COPY prisma ./prisma
RUN bun install

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "bunx prisma generate && bunx prisma migrate deploy && bun run start"]
