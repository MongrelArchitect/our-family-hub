FROM node:22

WORKDIR /our-family-hub

COPY package*.json .

RUN npm install yarn && yarn

COPY . .

CMD ["yarn", "dev"]
