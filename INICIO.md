# 🎬 SORTEADOR DE FILMES - GUIA DE INICIO RÁPIDO

Bem-vindo! Este é seu projeto completo de Sorteador de Filmes.

---

## 🚀 COMECE AQUI (5 minutos)

### 1️⃣ Abra o Terminal

```bash
cd c:\Users\Lucas\Documents\VIBE_CODING\sorteador_filmes
```

### 2️⃣ Instale as Dependências

```bash
npm install
```

Vai instalar:
- ✅ Express (framework web)
- ✅ Mongoose (MongoDB)
- ✅ CORS (requisições cross-origin)
- ✅ Dotenv (variáveis de ambiente)

### 3️⃣ Inicie MongoDB

**Opção A - MongoDB Local:**
```bash
mongod
```

**Opção B - MongoDB Atlas (Cloud):**
Já está configurado no `.env`

### 4️⃣ Inicie o Servidor

```bash
npm start
```

Você deve ver:
```
✓ Conectado ao MongoDB
🚀 Servidor rodando em http://localhost:3000
```

### 5️⃣ Abra no Navegador

```
http://localhost:3000
```

**Pronto! A aplicação está rodando!** 🎉

---

## 📁 ARQUIVOS CRIADOS

```
sorteador_filmes/
│
├── 📄 server.js                    ← BACKEND (Express + MongoDB)
│
├── 📄 index.html                   ← FRONTEND (HTML + CSS + JS)
│
├── 📄 package.json                 ← Dependências npm
│
├── 📄 .env                         ← Variáveis de ambiente
├── 📄 .env.example                 ← Exemplo de .env
│
├── 📄 .gitignore                   ← Arquivos a ignorar no Git
│
├── 📄 README.md                    ← Documentação completa
├── 📄 INSTALACAO_RAPIDA.md         ← Guia rápido (4 passos)
├── 📄 FAQ.md                       ← Perguntas frequentes
├── 📄 ARQUITETURA.md               ← Explicação técnica
├── 📄 EXEMPLOS_API.md              ← Exemplos de requisições
├── 📄 BOAS_PRATICAS.md             ← Melhorias e próximos passos
├── 📄 INICIO.md                    ← Este arquivo
│
└── 📁 public/                      ← Pasta para assets (futura)
```

---

## 🎯 O QUE VOCÊ PODE FAZER AGORA

✅ **Adicionar Filmes**
- Digite o nome do filme
- Clique no botão "+"
- Aparece na lista

✅ **Marcar como Assistido**
- Clique no botão de status
- Alterna entre "Assistido" e "Não assistido"

✅ **Sortear um Filme**
- Clique no grande botão "SORTEAR AGORA"
- O app sorteia um filme não assistido
- Resultado aparece em um modal elegante

✅ **Remover Filmes**
- Clique no botão 🗑️ de remover
- Confirma a ação

---

## 📚 DOCUMENTAÇÃO

Você tem 6 documentos para consultar:

| Arquivo | Assunto | Quando ler |
|---------|---------|-----------|
| [README.md](README.md) | 📖 Documentação completa | Primeiro |
| [INSTALACAO_RAPIDA.md](INSTALACAO_RAPIDA.md) | ⚡ 4 passos de instalação | Se tiver dúvida |
| [FAQ.md](FAQ.md) | ❓ Perguntas frequentes | Quando tiver problema |
| [EXEMPLOS_API.md](EXEMPLOS_API.md) | 📡 Como testar API | Se testar com Postman |
| [ARQUITETURA.md](ARQUITETURA.md) | 🏗️ Explicação técnica | Se quiser aprender |
| [BOAS_PRATICAS.md](BOAS_PRATICAS.md) | ✨ Melhorias futuras | Depois de usar |

---

## 🔌 ENDPOINTS DA API

```bash
# Adicionar filme
POST http://localhost:3000/api/filmes
Body: { "nome": "Matrix" }

# Listar filmes
GET http://localhost:3000/api/filmes

# Sortear filme
GET http://localhost:3000/api/sortear

# Alternar status
PATCH http://localhost:3000/api/filmes/:id

# Remover filme
DELETE http://localhost:3000/api/filmes/:id
```

---

## 🎨 DESIGN

O design foi criado inspirado no template **Agenciy** da Framer com:

- 🎨 **Cores**: Fundo dark (#0a0a0a), destaque roxo (#8b5cf6)
- 🏠 **Cards**: Elegantes com bordas arredondadas
- ✨ **Animações**: Transições suaves e modais fluidos
- 📱 **Responsivo**: Funciona em desktop, tablet e mobile

---

## 🆘 PROBLEMAS COMUNS

### ❌ Erro: "Cannot connect to MongoDB"

**Solução:**
1. Certifique-se que MongoDB está rodando (`mongod`)
2. Verifique a URL em `.env`
3. Se usar MongoDB Atlas, confirme suas credenciais

---

### ❌ Erro: "Port 3000 already in use"

**Solução:**
1. Mude a porta no `.env`: `PORT=3001`
2. Ou finalize o outro processo: `Get-Process node | Stop-Process`

---

### ❌ Página branca ao abrir http://localhost:3000

**Solução:**
1. Verifique se o servidor está rodando (veja o terminal)
2. Abra DevTools (F12) e veja a console por erros
3. Tente fazer refresh (Ctrl+R ou Cmd+R)

---

### ❌ Não consigo adicionar filmes

**Solução:**
1. Abra DevTools (F12) → Network
2. Veja se as requisições POST estão indo
3. Verifique a resposta (pode ser duplicata)

Para mais problemas, veja [FAQ.md](FAQ.md)

---

## 💡 DICAS

### Teste a API com cURL

```bash
# Adicionar filme
curl -X POST http://localhost:3000/api/filmes \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Matrix\"}"

# Listar filmes
curl http://localhost:3000/api/filmes

# Sortear
curl http://localhost:3000/api/sortear
```

### Teste com Postman

1. Baixe [Postman](https://www.postman.com)
2. Crie uma collection
3. Adicione requisições
4. Veja [EXEMPLOS_API.md](EXEMPLOS_API.md) para templates

---

## 🔐 SEGURANÇA

Este projeto implementa:

✅ Validação de entrada (frontend e backend)
✅ Proteção contra XSS (escape de HTML)
✅ CORS configurado
✅ Mongoose schema validation
✅ `.env` não é commitado

---

## 📊 TECNOLOGIAS USADAS

**Backend:**
- Node.js
- Express.js
- Mongoose + MongoDB
- CORS
- Dotenv

**Frontend:**
- HTML5 semântico
- CSS3 (variáveis, grid, flexbox, animações)
- JavaScript vanilla (Fetch API)

**Banco de Dados:**
- MongoDB (local ou Atlas)

---

## 🎓 ESTRUTURA DE PASTAS

```
sorteador_filmes/
├── server.js           ← Aqui estão as rotas da API
├── index.html          ← Aqui está toda a interface
├── package.json        ← Aqui estão as dependências
└── .env                ← Aqui estão as configurações
```

É assim simples! Sem subpastas complicadas. Fácil de entender e escalar.

---

## 🚀 PRÓXIMOS PASSOS (Opcional)

Se quiser melhorar o projeto:

1. **Teste a API** com [EXEMPLOS_API.md](EXEMPLOS_API.md)
2. **Estude o código** em [ARQUITETURA.md](ARQUITETURA.md)
3. **Implemente melhorias** de [BOAS_PRATICAS.md](BOAS_PRATICAS.md)
4. **Faça deploy** (Railway, Heroku, etc)

---

## 📞 SUPORTE

Se tiver dúvidas:

1. Verifique a **console do navegador** (F12)
2. Verifique os **logs do servidor**
3. Leia [FAQ.md](FAQ.md)
4. Pesquise o erro no Google
5. Abra uma issue no GitHub

---

## ✨ BOA SORTE!

Aproveite seu sistema de Sorteador de Filmes!

Se gostar do projeto, faça algumas sugestões:
- ⭐ Avaliações (1-5 estrelas)
- 🎬 Pôsteres de filmes
- 🔍 Busca avançada
- 📊 Estatísticas
- 👥 Compartilhamento

**Agora, execute `npm start` e comece!** 🎬🍿

---

## 📄 Sumário de Arquivos

### Código-fonte (o que rodar)
- `server.js` - Backend 100% funcional
- `index.html` - Frontend 100% funcional

### Configuração (configurar uma vez)
- `package.json` - Dependências (já pronto)
- `.env` - Variáveis (já pronto)
- `.gitignore` - Arquivos ignorados (já pronto)

### Documentação (ler quando tiver dúvida)
- `README.md` - Guia completo
- `INSTALACAO_RAPIDA.md` - 4 passos
- `FAQ.md` - Perguntas frequentes
- `ARQUITETURA.md` - Como funciona
- `EXEMPLOS_API.md` - Como testar
- `BOAS_PRATICAS.md` - Como melhorar

---

**Versão:** 1.0.0
**Data:** Janeiro 2025
**Stack:** Node.js + MongoDB + Vanilla JavaScript
**Status:** ✅ Pronto para usar!
