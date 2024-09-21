FROM node:22

WORKDIR /our-family-hub

COPY package*.json .

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]
