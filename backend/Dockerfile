##### BUILDER STAGE #####
FROM node:22-alpine AS builder

# Install build tools required for native modules (sharp, better-sqlite3)
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev bash

ENV NODE_ENV=production

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build Strapi (compiles TS → dist/, builds admin panel)
RUN npm run build

##### PRODUCTION STAGE #####
FROM node:22-alpine AS production

RUN apk add --no-cache vips curl

ENV NODE_ENV=production
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
ENV PORT=1337
ENV HOST=0.0.0.0

WORKDIR /app

# Copy only what's needed to run
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/favicon.png ./favicon.png

RUN mkdir -p /app/public/uploads

EXPOSE 1337

CMD ["npm", "run", "start"]
