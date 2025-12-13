FROM oven/bun:1
WORKDIR /app
COPY . .

RUN bun install
RUN bunx prisma generate

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
