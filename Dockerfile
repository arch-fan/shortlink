FROM node:lts-alpine as build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

FROM node:lts-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --production

COPY --from=build /app/dist ./dist
COPY public/ ./public

EXPOSE 4321

CMD ["pnpm", "run", "start"]