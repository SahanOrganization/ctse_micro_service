FROM node:16-alpine
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["npm","start"]