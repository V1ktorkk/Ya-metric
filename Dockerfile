FROM --platform=amd64 node:16-alpine as builder

WORKDIR /app

ARG BUILD_ENV=production

COPY ./ .
RUN npm ci \
  && npm run build:${BUILD_ENV}

FROM --platform=amd64 node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY ./ .

RUN npm ci --omit=dev

EXPOSE 3000

CMD npm run serve
