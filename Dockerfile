FROM node:20

# Diretório de trabalho
WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copiar o resto do código
COPY . .

# Expor a porta padrão do ng serve
EXPOSE 4200

# Comando para rodar o Angular em modo dev
CMD ["ng", "serve", "--host", "0.0.0.0"]
