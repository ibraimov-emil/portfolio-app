FROM node:22-alpine AS builder

RUN apk add --no-cache make gcc g++ python3 curl

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

RUN sed -i 's/dns\.lookup(this\.host, function/dns.lookup(this.host, {family: 4}, function/' node_modules/pg/lib/connection-parameters.js \
    && sed -i '2a const dns = require("dns");\nconst net = require("net");' node_modules/pg/lib/connection.js \
    && sed -i 's/this\.stream\.connect(port, host)/if(net.isIP(host)){this.stream.connect(port, host)}else{dns.lookup(host,{family:4},(err,address)=>{if(err)return this.emit("error",err);this.stream.connect(port,address)})}/' node_modules/pg/lib/connection.js

FROM node:22-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/types ./types
COPY --from=builder /app/package.json ./package.json

ENV NODE_OPTIONS="--dns-result-order=ipv4first"
ENV PORT=1337
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD curl -f http://localhost:1337/admin || exit 1

CMD ["node", "dist/strapi.js", "start"]
