FROM node:25-alpine

RUN npm install -g pnpm@10.30.0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

CMD [ "pnpm", "dev" ]
