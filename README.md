# 🎬 Sorteador de Filmes

Um sistema elegante e minimalista para gerenciar sua lista de filmes e sortear qual assistir! Desenvolvido com Node.js, Express, MongoDB e vanilla JavaScript.

---

## ✨ Características

- ✅ **Interface Moderna**: Design dark/minimalista inspirado no template Agenciy da Framer
- ✅ **Adicionar Filmes**: Cadastre filmes com validação de duplicatas
- ✅ **Marcar Status**: Alterne entre "Assistido" e "Não assistido"
- ✅ **Sortear Filme**: Sorteia aleatoriamente um filme não assistido
- ✅ **API RESTful**: Backend robusto com Express e Mongoose
- ✅ **Responsivo**: Funciona perfeitamente em desktop e mobile
- ✅ **Segurança**: Validações no frontend e backend

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Mongoose** - ODM para MongoDB
- **CORS** - Controle de requisições cross-origin
- **Dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com variáveis CSS
- **JavaScript Nativo** - Interatividade com Fetch API

### Database
- **MongoDB** - Banco de dados NoSQL

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **Node.js** (v16+)
   - Download: https://nodejs.org/
   - Verifique: `node --version`

2. **MongoDB** (Local ou Cloud)
   - **Opção 1 - Local**: https://www.mongodb.com/try/download/community
   - **Opção 2 - Cloud (MongoDB Atlas)**: https://www.mongodb.com/cloud/atlas

3. **npm** (Geralmente vem com Node.js)
   - Verifique: `npm --version`

---

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

Este comando instala todos os pacotes necessários listados no `package.json`:
- `express` - Framework web
- `mongoose` - Conexão com MongoDB
- `cors` - Suporte a requisições cross-origin
- `dotenv` - Variáveis de ambiente

### 2. Configurar Variáveis de Ambiente

Abra o arquivo `.env` na raiz do projeto e configure:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/sorteador_filmes
NODE_ENV=development
```

**Para MongoDB Local:**
```env
MONGO_URI=mongodb://localhost:27017/sorteador_filmes
```

**Para MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/sorteador_filmes
```

### 3. Verificar Conexão com MongoDB

**Se usar MongoDB Local:**
```bash
# Windows PowerShell
mongod

# Ou com Chocolatey (se instalado)
choco install mongodb
```

**Se usar MongoDB Atlas (Cloud):**
- Apenas certifique-se de estar conectado à internet

### 4. Iniciar o Servidor

```bash
npm start
# ou
node server.js
```

Você deve ver:
```
✓ Conectado ao MongoDB
🚀 Servidor rodando em http://localhost:3000
```

### 5. Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

---

## 📚 Estrutura do Projeto

```
sorteador_filmes/
├── server.js           # Backend (Express, Mongoose, Rotas da API)
├── index.html          # Frontend (HTML, CSS, JavaScript)
├── package.json        # Dependências do projeto
├── .env                # Variáveis de ambiente (LOCAL)
├── .env.example        # Exemplo de variáveis de ambiente
└── README.md           # Este arquivo
```

---

## 🔌 API Endpoints

### POST `/api/filmes`
Adiciona um novo filme.

**Request:**
```json
{
  "nome": "Matrix"
}
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Filme adicionado com sucesso",
  "filme": {
    "_id": "64f7c3a9b2e8f1a2c3d4e5f6",
    "nome": "Matrix",
    "status": "Não assistido",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### GET `/api/filmes`
Retorna todos os filmes cadastrados.

**Query Params (Opcionais):**
- `status=Assistido` - Filtra apenas os assistidos
- `status=Não assistido` - Filtra apenas os não assistidos

**Response:**
```json
{
  "sucesso": true,
  "total": 3,
  "filmes": [
    {
      "_id": "64f7c3a9b2e8f1a2c3d4e5f6",
      "nome": "Matrix",
      "status": "Não assistido"
    }
  ]
}
```

---

### PATCH `/api/filmes/:id`
Alterna o status do filme (Não assistido ↔ Assistido).

**Request:**
```
PATCH /api/filmes/64f7c3a9b2e8f1a2c3d4e5f6
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Status alterado para \"Assistido\"",
  "filme": {
    "_id": "64f7c3a9b2e8f1a2c3d4e5f6",
    "nome": "Matrix",
    "status": "Assistido"
  }
}
```

---

### GET `/api/sortear`
Sorteia um filme aleatório não assistido.

**Response (Sucesso):**
```json
{
  "sucesso": true,
  "mensagem": "Filme sorteado com sucesso!",
  "filme": {
    "_id": "64f7c3a9b2e8f1a2c3d4e5f6",
    "nome": "Matrix",
    "status": "Não assistido"
  }
}
```

**Response (Sem filmes elegíveis):**
```json
{
  "sucesso": false,
  "mensagem": "🎬 Nenhum filme disponível para sortear!",
  "filme": null
}
```

---

### DELETE `/api/filmes/:id`
Remove um filme do banco de dados.

**Request:**
```
DELETE /api/filmes/64f7c3a9b2e8f1a2c3d4e5f6
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Filme removido com sucesso"
}
```

---

## 🎨 Design e Interface

A interface foi inspirada no template **Agenciy** da Framer com:

- **Cores**:
  - Fundo: `#0a0a0a` (Dark profundo)
  - Destaque: `#8b5cf6` (Roxo neon)
  - Texto: `#ffffff` (Branco puro)

- **Componentes**:
  - Cards com bordas suavemente arredondadas
  - Sombras sutis com efeito glow
  - Animações suaves de transição
  - Layout totalmente responsivo

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"
**Solução:**
1. Verifique se MongoDB está rodando
2. Confirme a URL em `.env`
3. Se usar MongoDB Atlas, verifique suas credenciais

### Erro: "CORS blocked"
**Solução:**
- O servidor já está configurado com CORS
- Se usar outro frontend, verifique as origens permitidas

### Porta 3000 já está em uso
**Solução:**
```bash
# Mude a porta no arquivo .env
PORT=3001

# Ou finalize o processo usando a porta 3000
# Windows PowerShell:
Get-Process -Name node | Stop-Process
```

### Filme duplicado não é adicionado
**Esperado!** A validação verifica duplicatas (case-insensitive)

---

## 📝 Exemplo de Uso

1. **Abra a aplicação** em http://localhost:3000
2. **Digite um filme** (ex: "Matrix")
3. **Clique em "+"** para adicionar
4. **Repita** para adicionar mais filmes
5. **Clique em "Sortear Agora"** para sortear um filme
6. **Marque como Assistido** quando terminar de assistir
7. **Remova** filmes que não quer mais

---

## 📦 Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm start

# Ou diretamente com Node
node server.js
```

---

## 🔐 Segurança

- ✅ Validação de entrada (frontend e backend)
- ✅ Proteção contra XSS (HTML escape)
- ✅ CORS configurado
- ✅ Tratamento robusto de erros
- ✅ Mongoose schema validation

---

## 📄 Schema do MongoDB

```javascript
{
  nome: String (obrigatório, único),
  status: String ("Não assistido" ou "Assistido"),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

---

## 🤝 Contribuições

Sinta-se livre para melhorar este projeto!

---

## 📧 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do servidor
3. Confirme que MongoDB está conectado

---

## 📄 Licença

Este projeto é de código aberto e disponível para uso pessoal e educacional.

---

**Desenvolvido com ❤️ como um projeto Full Stack completo**

Aproveite e bom filme! 🍿🎬
