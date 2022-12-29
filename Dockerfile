FROM node:19-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY tsconfig.build.json ./tsconfig.build.json
COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN npm run build

FROM node:19-alpine AS runner

EXPOSE 5858

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=builder /app/build ./

RUN npm install

CMD ["node", "index.js"]
