FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY bunfig.toml .
COPY preload.ts .
COPY public public

CMD ["bun", "src/index.ts"]