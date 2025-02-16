FROM node:18-slim AS base
RUN apt-get update && apt-get install -y ffmpeg python3 && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json ./

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build

FROM base AS deploy
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
CMD ["pnpm", "start"]