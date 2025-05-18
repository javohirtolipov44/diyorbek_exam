# 1. Rasmiy imij
FROM node:20-alpine

# 2. Ishchi katalog
WORKDIR /app

# 3. Fayllarni ko‘chirish
COPY package*.json ./
RUN npm install

COPY . .

# 4. Prisma generate
RUN npx prisma generate

# ⚠️ migrate ni bu yerda emas, container startda bajariladi

# 5. Build NestJS
RUN npm run build

# 6. Port va start
EXPOSE 8080
CMD ["node", "dist/main"]
