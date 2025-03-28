FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "dev"]
