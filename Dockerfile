# Stage 1 (build + base)
FROM node:12.8.1-slim as build
LABEL org.opencontainers.image.authors="Juliette Tworsey"
LABEL org.opencontainers.image.title="Node.js Ultimate Dockerfile"
LABEL org.opencontainers.image.licenses=MIT

EXPOSE 3000
WORKDIR /usr/src/app
# Use wildcard * in case lock file does not yet exist
COPY package*.json  ./
# Double Ampersand => first command has to successfully install BEFORE the clean
# npm cache clean => make sure no left over files downloaded from NPM
# we use npm ci here so only the package-lock.json file is used in production
# npm config list => gets config info on how NPM & Node.js are set up => good for logging/debugging...
RUN npm config list
RUN npm ci \
    && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN npm run build


FROM build as dev
ENV NODE_ENV=development
COPY . .
EXPOSE  3000
# NOTE: these apt dependencies are only needed
# for testing. they shouldn't be in production
RUN apt-get update -qq && apt-get install -qy \
    ca-certificates \
    bzip2 \
    curl \
    libfontconfig \
    --no-install-recommends
RUN npm config list
RUN npm install --only=development \
    && npm cache clean --force
USER node
CMD [ "npm", "start" ]

# Stage 3 => Test
FROM dev as test
COPY . .
RUN npm audit
# Add security scanner
#NOTE: don't need to add ca certificates here w/apt-get => already done via dev stage
ARG MICROSCANNER_TOKEN
ADD https://get.aquasec.com/microscanner /
USER root
RUN chmod +x /microscanner
RUN /microscanner $MICROSCANNER_TOKEN --continue-on-failure

# docker build -t corona-board-master .
# docker run -p 3000:3000 corona-board-master

# docker build -t corona-board-master:build --target build .

# docker build -t corona-board-master:dev --target dev .
# docker run -p 3000:3000 corona-board-master:dev

# docker build -t corona-board-master:test --target test .
# docker run --init corona-board-master:test

# docker build -t corona-board-master:prod --target prod .
# docker run -p 3000:3000 corona-board-master:prod
