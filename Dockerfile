FROM node:22-alpine AS base
RUN corepack enable

# ── Dependencies ──
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    else npm install; fi

# ── Build ──
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN if [ -f pnpm-lock.yaml ]; then pnpm build; \
    else npm run build; fi

# ── Production ──
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

EXPOSE 4540
ENV PORT=4540 HOST=0.0.0.0
CMD ["node", ".output/server/index.mjs"]
