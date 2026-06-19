# 📡 Exemplos de Uso da API

Este documento contém exemplos de como testar a API do Sorteador de Filmes usando `curl`, `Postman` ou outra ferramenta de teste de API.

---

## 🔧 Base URL
```
http://localhost:3000/api
```

---

## 📝 Exemplos com cURL

### 1. Adicionar um Filme (POST)

```bash
curl -X POST http://localhost:3000/api/filmes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Matrix"}'
```

**Resposta:**
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

### 2. Listar Todos os Filmes (GET)

```bash
curl http://localhost:3000/api/filmes
```

**Resposta:**
```json
{
  "sucesso": true,
  "total": 2,
  "filmes": [
    {
      "_id": "64f7c3a9b2e8f1a2c3d4e5f6",
      "nome": "Matrix",
      "status": "Não assistido"
    },
    {
      "_id": "64f7c3a9b2e8f1a2c3d4e5f7",
      "nome": "Inception",
      "status": "Assistido"
    }
  ]
}
```

---

### 3. Filtrar Filmes por Status (GET)

**Apenas filmes não assistidos:**
```bash
curl "http://localhost:3000/api/filmes?status=Não%20assistido"
```

**Apenas filmes assistidos:**
```bash
curl "http://localhost:3000/api/filmes?status=Assistido"
```

---

### 4. Alternar Status do Filme (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/filmes/64f7c3a9b2e8f1a2c3d4e5f6 \
  -H "Content-Type: application/json"
```

**Resposta:**
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

### 5. Sortear um Filme (GET)

```bash
curl http://localhost:3000/api/sortear
```

**Resposta (Sucesso):**
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

**Resposta (Sem filmes elegíveis):**
```json
{
  "sucesso": false,
  "mensagem": "🎬 Nenhum filme disponível para sortear!",
  "filme": null
}
```

---

### 6. Remover um Filme (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/filmes/64f7c3a9b2e8f1a2c3d4e5f6
```

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Filme removido com sucesso"
}
```

---

## 📱 Exemplos com Postman

### Importar Coleção

Você pode importar esta coleção no Postman:

```json
{
  "info": {
    "name": "Sorteador de Filmes API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Adicionar Filme",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"nome\":\"Matrix\"}"
        },
        "url": {
          "raw": "http://localhost:3000/api/filmes",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "filmes"]
        }
      }
    },
    {
      "name": "Listar Filmes",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/api/filmes",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "filmes"]
        }
      }
    },
    {
      "name": "Sortear Filme",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/api/sortear",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "sortear"]
        }
      }
    },
    {
      "name": "Alternar Status",
      "request": {
        "method": "PATCH",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "url": {
          "raw": "http://localhost:3000/api/filmes/:id",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "filmes", ":id"]
        }
      }
    },
    {
      "name": "Remover Filme",
      "request": {
        "method": "DELETE",
        "url": {
          "raw": "http://localhost:3000/api/filmes/:id",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "filmes", ":id"]
        }
      }
    }
  ]
}
```

---

## 🧪 Cenários de Teste

### Cenário 1: Adicionar Filmes e Listar

1. Adicione "Matrix"
2. Adicione "Inception"
3. Adicione "Interstellar"
4. Faça GET `/api/filmes` para listar todos

---

### Cenário 2: Marcar como Assistido

1. Obtenha o `_id` de um filme de GET `/api/filmes`
2. Faça PATCH com o ID para alterar status
3. Confirme que o status mudou

---

### Cenário 3: Sortear Filme

1. Certifique-se de ter pelo menos 1 filme com status "Não assistido"
2. Faça GET `/api/sortear`
3. Um filme deve ser sorteado

---

### Cenário 4: Filme Duplicado

1. Tente adicionar "Matrix" duas vezes
2. A segunda tentativa deve retornar erro 409

---

### Cenário 5: ID Inválido

1. Tente fazer PATCH com um ID inválido
2. Deve retornar erro 400

---

## 🔍 Códigos de Status HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Duplicata detectada |
| 500 | Server Error - Erro no servidor |

---

## 💡 Dicas

- Use variáveis no Postman para reutilizar o `_id`
- Configure um environment com `BASE_URL = http://localhost:3000/api`
- Use pre-request scripts para validações
- Salve as respostas para documentação

---

## 🐛 Debugging

Se receber erro 500:
1. Verifique os logs do servidor
2. Confirme que MongoDB está conectado
3. Valide a URL MONGO_URI no `.env`

Se receber erro CORS:
1. Verifique se o servidor está rodando
2. Confirme que está usando a URL correta

---

Boa sorte testando! 🧪✨
