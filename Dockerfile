# Ref: https://dev.to/erezhod/setting-up-a-nestjs-project-with-docker-for-back-end-development-30lg
# Ref: https://notiz.dev/blog/prisma-migrate-deploy-with-docker
FROM node:14-alpine AS build
    # Create app directory
    WORKDIR /usr/src/app

    COPY package*.json ./
    COPY tsconfig*.json ./
    COPY ./src ./src
    COPY ./static/ ./static
    
    # 1. install
    RUN npm install

    ## 2. build
    RUN npm run build

FROM node:14-alpine
    # Create app directory
    WORKDIR /usr/src/app

    COPY --from=build /usr/src/app/dist ./dist
    COPY --from=build /usr/src/app/static ./static
    COPY --from=build /usr/src/app/node_modules ./node_modules
    COPY --from=build /usr/src/app/package*.json ./
    COPY --from=build /usr/src/app/tsconfig*.json ./

# ENTRYPOINT ["node", "dist/main"]