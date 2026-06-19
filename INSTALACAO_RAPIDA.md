# 🚀 GUIA RÁPIDO DE INSTALAÇÃO

## 1️⃣ Instalar as Dependências
```bash
npm install
```

## 2️⃣ Configurar MongoDB

### Opção A: MongoDB Local
- Instale: https://www.mongodb.com/try/download/community
- Inicie: `mongod` (no CMD/PowerShell)

### Opção B: MongoDB Cloud (Atlas)
- Crie conta: https://www.mongodb.com/cloud/atlas
- Crie um cluster
- Copie a URL de conexão no `.env`

## 3️⃣ Configurar `.env`

Abra o arquivo `.env` e defina:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/sorteador_filmes
NODE_ENV=development
```

Ou para MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/sorteador_filmes
```

## 4️⃣ Iniciar o Servidor

```bash
npm start
# ou
node server.js
```

## 5️⃣ Acessar a Aplicação

Abra no navegador:
```
http://localhost:3000
```

---

## ✅ Está Funcionando?

Você deve ver:
- ✓ "Conectado ao MongoDB" (console)
- 🚀 "Servidor rodando em http://localhost:3000"
- 🎬 Interface carregada no navegador

---

## 📦 Pacotes Instalados

```bash
npm install express mongoose cors dotenv
```

- **express** - Framework web
- **mongoose** - Conexão com MongoDB
- **cors** - Requisições cross-origin
- **dotenv** - Variáveis de ambiente

---

## 🎯 Pronto!

Agora você pode:
- ✅ Adicionar filmes
- ✅ Marcar como assistido/não assistido
- ✅ Sortear um filme
- ✅ Remover filmes

Bom filme! 🍿🎬
