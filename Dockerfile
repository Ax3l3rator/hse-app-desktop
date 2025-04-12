FROM node:20 AS tsbuilder

WORKDIR /app

RUN apt install git

COPY . .

COPY ./package.json ./yarn.lock ./

RUN yarn --frozen-lockfile

RUN yarn generate

FROM electronuserland/builder:wine AS electron-builder

RUN npm install -g electron-builder

ENV ELECTRON_CACHE="/root/.cache/electron"
ENV ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder"

WORKDIR /build_dir
#/app/build, /app/dist-electron, /app/.output
COPY --from=tsbuilder /app/build ./build
COPY --from=tsbuilder /app/dist-electron ./dist-electron
COPY --from=tsbuilder /app/.output ./.output
COPY --from=tsbuilder /app/node_modules ./node_modules

COPY ./package.json ./

CMD [ "yarn", "build:linux" ]
