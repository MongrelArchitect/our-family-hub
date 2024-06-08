FROM node:22

WORKDIR /our-family-hub

COPY package*.json .

RUN npm install yarn && yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]
