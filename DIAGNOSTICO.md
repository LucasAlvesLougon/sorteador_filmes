# 🔧 GUIA DE DIAGNÓSTICO - Erro de Conexão

Se você está recebendo erro ao conectar com o servidor, siga este guia passo a passo.

---

## ✅ CHECKLIST DE DIAGNÓSTICO

### Passo 1: Reinicie o servidor

**No terminal, faça:**

```bash
# 1. Pressione Ctrl+C para parar o servidor (se estiver rodando)

# 2. Reinicie
npm start
```

**Esperado:**
```
🔌 Tentando conectar ao MongoDB...
📍 URI: mongodb+srv://lucasmal2005_db_user:z...
✅ Conectado ao MongoDB com sucesso!
🚀 Servidor rodando em http://localhost:3000
```

---

### Passo 2: Teste o Health Check

Abra uma **aba nova do navegador** e acesse:

```
http://localhost:3000/api/health
```

**Esperado (se tudo ok):**
```json
{
  "sucesso": true,
  "status": "Servidor OK",
  "servidor": {
    "rodando": true,
    "porta": 3000,
    "ambiente": "development"
  },
  "banco_de_dados": {
    "conectado": true,
    "uri_parcial": "mongodb+srv://..."
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Se vir erro**, veja o que significa:
- Status 503 = Banco não conectado
- Status 500 = Erro no servidor
- Conexão recusada = Servidor não está rodando

---

### Passo 3: Abra DevTools (F12)

No navegador principal (http://localhost:3000):

1. Pressione **F12**
2. Vá na aba **Console**
3. Procure por mensagens vermelhas
4. **Copie a mensagem de erro**

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### ❌ Erro 1: "Cannot GET /"

**Causa:** Frontend não está sendo servido  
**Solução:**
```bash
# Verifique se o index.html está na raiz do projeto
ls index.html

# Se não existir, copie de volta:
# (Este arquivo deve estar em c:\Users\Lucas\Documents\VIBE_CODING\sorteador_filmes\index.html)
```

---

### ❌ Erro 2: "MONGO_URI" não está definido

**Causa:** Variável de ambiente não carregada  
**Solução:**
1. Verifique o arquivo `.env`
2. Certifique-se de que tem: `MONGO_URI=mongodb+srv://...`
3. Reinicie o servidor: `npm start`

---

### ❌ Erro 3: "connect ECONNREFUSED"

**Causa:** MongoDB não está acessível  
**Solução:**

**Opção A - MongoDB Atlas (Cloud):**
1. Abra https://www.mongodb.com/cloud/atlas
2. Faça login
3. Verifique se o cluster está rodando (não pausado)
4. Verifique se seu IP está na whitelist
5. Tente conectar novamente

**Opção B - MongoDB Local:**
1. Instale MongoDB Community: https://www.mongodb.com/try/download/community
2. Inicie o serviço: `mongod`
3. Mude o `.env` para:
```env
MONGO_URI=mongodb://localhost:27017/sorteador_filmes
```

---

### ❌ Erro 4: "UnauthorizedError: authentication failed"

**Causa:** Credenciais do MongoDB estão erradas  
**Solução:**
1. Verifique o usuário e senha no `.env`
2. Confirme que estão corretos em https://www.mongodb.com/cloud/atlas
3. Se a senha tem caracteres especiais, pode precisar de URL encoding

---

### ❌ Erro 5: "fetch failed" no DevTools

**Causa:** Frontend não consegue falar com backend  
**Solução:**
1. Certifique-se que o servidor está rodando (veja Passo 1)
2. Tente acessar http://localhost:3000/api/health
3. Se não conseguir, o servidor não está ouvindo na porta 3000
4. Mude a porta em `.env`: `PORT=3001`

---

### ❌ Erro 6: "CORS error"

**Causa:** Configuração de CORS (improvável se não mudou)  
**Solução:**
```javascript
// No server.js, certifique-se de ter:
app.use(cors());  // Deve estar ANTES das rotas!
```

---

## 🆘 TESTE PASSO A PASSO

Se nada acima funcionou, teste assim:

### 1️⃣ Terminal 1 - Veja logs do servidor

```bash
npm start
```

Procure por:
- ✅ "Tentando conectar ao MongoDB..."
- ✅ "Conectado ao MongoDB com sucesso!"
- ✅ "Servidor rodando em http://localhost:3000"

Se não vê essas mensagens, há erro no MongoDB.

---

### 2️⃣ Terminal 2 - Teste a API com curl

Abra outro terminal e faça:

```bash
# Teste 1: Health check
curl http://localhost:3000/api/health

# Teste 2: Listar filmes
curl http://localhost:3000/api/filmes

# Teste 3: Adicionar filme
curl -X POST http://localhost:3000/api/filmes ^
  -H "Content-Type: application/json" ^
  -d "{\"nome\":\"Matrix\"}"
```

Se funcionar, o servidor está OK. O problema é no frontend.

---

### 3️⃣ Browser - Veja DevTools

Abra http://localhost:3000

Pressione F12 → Console

Procure por:
```
GET /api/filmes
GET /api/sortear
```

Clique nelas e veja:
- **Status**: Deve ser 200
- **Response**: Deve ter JSON válido
- **Console**: Deve estar limpo (sem erros vermelhos)

---

## 📋 CHECKLIST FINAL

- [ ] Servidor rodando: `npm start`
- [ ] Health check responde: `http://localhost:3000/api/health`
- [ ] MongoDB conectado (vejo ✅ nos logs)
- [ ] DevTools aberto (F12)
- [ ] Nenhum erro vermelho na console
- [ ] Frontend carrega em http://localhost:3000
- [ ] Consigo adicionar filmes
- [ ] Consigo sortear filmes

Se todos ✅, tudo está funcionando!

---

## 💡 DICAS

**Se receber erro intermitente:**
- Pode ser timeout do MongoDB Atlas
- Tente novamente em alguns segundos
- Aumente o timeout no `.env` (adicione):
```env
MONGODB_TIMEOUT=30000
```

**Se receber erro "ENOTFOUND":**
- Pode ser problema de DNS
- Tente reiniciar o router/modem
- Ou teste com IP fixo ao invés de URL

**Se nada funciona:**
1. Copie a mensagem de erro exata
2. Acesse https://stackoverflow.com
3. Procure a mensagem (ela provavelmente já foi respondida)

---

## 🔗 RECURSOS ÚTEIS

- MongoDB Atlas Help: https://docs.mongodb.com/atlas/
- Express Troubleshooting: https://expressjs.com/en/guide/error-handling.html
- CORS Issues: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## 📞 SUPORTE

Se ainda não conseguir resolver:

1. **Abra DevTools (F12)** e copie a mensagem de erro exata
2. **Verifique os logs do servidor** (terminal onde rodou `npm start`)
3. **Teste o health check**: http://localhost:3000/api/health
4. **Pesquise a mensagem de erro** no Google/Stack Overflow
5. Se for erro de MongoDB, vá em: https://www.mongodb.com/community/forums/

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2025  
**Status:** ✅ Guia completo de diagnóstico
