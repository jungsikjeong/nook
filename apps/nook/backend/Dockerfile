# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20-alpine
ARG PNPM_VERSION=10.33.0

############################################
# Base: enable pnpm via corepack
############################################
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /repo

############################################
# Deps: install workspace deps (from monorepo root)
############################################
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/nook/backend/package.json apps/nook/backend/package.json
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter backend...

############################################
# Builder: copy source and build
############################################
FROM deps AS builder
COPY apps/nook/backend ./apps/nook/backend
RUN pnpm --filter backend build

############################################
# Runner: production image
############################################
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /repo

COPY --from=deps    /repo/node_modules ./node_modules
COPY --from=deps    /repo/apps/nook/backend/node_modules ./apps/nook/backend/node_modules
COPY --from=builder /repo/apps/nook/backend/dist ./apps/nook/backend/dist
COPY apps/nook/backend/package.json ./apps/nook/backend/package.json
COPY apps/nook/backend/drizzle ./apps/nook/backend/drizzle

WORKDIR /repo/apps/nook/backend
EXPOSE 3001
CMD ["node", "dist/main.js"]

############################################
# Dev: hot-reload target for docker compose
############################################
FROM deps AS dev
WORKDIR /repo/apps/nook/backend
ENV NODE_ENV=development
EXPOSE 3001
CMD ["pnpm", "dev"]
