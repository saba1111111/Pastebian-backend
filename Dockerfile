FROM node:18 as development

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build 

FROM node:18 as production

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install --production=true

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]