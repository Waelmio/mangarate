# BUILDING
FROM node:18 as ts-compiler

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY tsconfig*.json ./
COPY MangaRate.Api/package*.json ./MangaRate.Api/
COPY MangaRate.Api/tsconfig*.json ./MangaRate.Api/
COPY MangaRate.UI/package*.json ./MangaRate.UI/
COPY MangaRate.UI/tsconfig*.json ./MangaRate.UI/

RUN npm install

# Copy source files
COPY . ./

RUN npm run build

# CLEANING

FROM node:18 as ts-remover

WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/MangaRate.Api/package*.json ./MangaRate.Api/
COPY --from=ts-compiler /usr/app/MangaRate.UI/package*.json ./MangaRate.UI/
RUN npm install --only=production
COPY --from=ts-compiler /usr/app/build ./

# FINAL

FROM gcr.io/distroless/nodejs:18
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./

USER 1000
EXPOSE 7000
ENV NODE_ENV=production

CMD ["src/index.js"]