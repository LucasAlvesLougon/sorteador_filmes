# 🔒 GUIA COMPLETO DE SEGURANÇA PARA PRODUÇÃO

## 1. PROTEÇÃO DE SENHAS E CREDENCIAIS

### ✅ **O que você JÁ tem feito correto:**
- ✓ Arquivo `.env` com `MONGO_URI` sensível
- ✓ Usando `require('dotenv').config()` para carregar variáveis

### ⚠️ **O que FALTA adicionar:**

#### 1.1 - Verificar `.gitignore` (CRÍTICO!)
```bash
# Seu .gitignore DEVE conter:
.env
.env.local
.env.*.local
node_modules/
```

**Teste se está funcionando:**
```bash
# No terminal, execute:
git status
```

Se `.env` NÃO aparecer na lista, está correto! ✅
Se APARECE, você expôs suas credenciais. CRIE UM NOVO TOKEN IMEDIATAMENTE.

#### 1.2 - Arquivo `.env.example` (SEM SENHAS)
Crie um modelo para documentar qual variáveis são necessárias:

```env
# .env.example - NUNCA COLOQUE SENHAS REAIS AQUI
PORT=3000
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.xxx.mongodb.net/sorteador_filmes?retryWrites=true&w=majority
NODE_ENV=production
```

**Por que?** Quando outras pessoas clonarem seu repositório, sabem qual variáveis precisam configurar.

---

## 2. MEDIDAS DE SEGURANÇA NO CÓDIGO

### 2.1 - Instale Helmet.js (Headers de Segurança)
```bash
npm install helmet
```

Adicione no seu `server.js` (logo após o express.json()):
```javascript
const helmet = require('helmet');

app.use(helmet()); // Adiciona headers de segurança HTTP
```

**O que faz?** Protege contra:
- Clickjacking (X-Frame-Options)
- XSS (Content-Security-Policy)
- MIME Sniffing
- Outras vulnerabilidades HTTP

### 2.2 - Rate Limiting (Proteção contra Brute Force)
```bash
npm install express-rate-limit
```

Adicione no seu `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

// Limita requisições por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true, // Retorna info em `RateLimit-*` headers
  legacyHeaders: false, // Desabilita `X-RateLimit-*` headers
});

app.use(limiter);
```

### 2.3 - CORS Seguro (NÃO use * em produção)
**Seu código ATUAL (não seguro):**
```javascript
app.use(cors()); // Permite qualquer origem!
```

**Mude para (SEGURO):**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

**Em produção, no `.env`:**
```env
FRONTEND_URL=https://seu-dominio.com
```

### 2.4 - Validação de Entrada (Sanitização)
```bash
npm install express-validator
```

No seu `server.js`, valide antes de salvar:
```javascript
const { body, validationResult } = require('express-validator');

// No seu POST /api/filmes:
app.post('/api/filmes', 
  body('nome').trim().notEmpty().isLength({ max: 200 }), // Valida
  (req, res) => {
    // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucesso: false, erros: errors.array() });
    }
    // ... resto do código
  }
);
```

**O que protege?** XSS, NoSQL Injection, dados malformados

### 2.5 - Senhas com Hash (Se implementar autenticação)
```bash
npm install bcryptjs
```

Exemplo:
```javascript
const bcrypt = require('bcryptjs');

// Ao criar usuário:
const senhaHash = await bcrypt.hash(senhaPlana, 10);

// Ao fazer login:
const senhaValida = await bcrypt.compare(senhaPlana, senhaHash);
```

**NUNCA** armazene senhas em texto plano!

---

## 3. VARIÁVEIS DE AMBIENTE EM PRODUÇÃO

### Para RENDER:
1. Vá ao seu projeto em `https://dashboard.render.com`
2. Clique em **Environment**
3. Adicione:
   ```
   PORT=3000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://lucasmal2005_db_user:zyko9gv2rwTup9jL@cluster0.zhcqq15.mongodb.net/sorteador_filmes?retryWrites=true&w=majority
   FRONTEND_URL=https://seu-app.onrender.com
   ```

### Para RAILWAY:
1. Vá ao seu projeto em `https://railway.app`
2. Clique em **Variables**
3. Adicione as mesmas variáveis

**IMPORTANTE:** Não coloque as variáveis no código, SEMPRE use o painel da plataforma!

---

## 4. LOGGING SEGURO

### ❌ NUNCA registre informações sensíveis:
```javascript
// RUIM - Expõe senha!
console.log(`Conectando com: ${process.env.MONGO_URI}`);

// BOM - Mostra apenas início da URI:
console.log(`Conectando a: ${process.env.MONGO_URI.substring(0, 50)}...`);
```

**Seu código JÁ faz isso corretamente!** ✅

---

## 5. ATUALIZAÇÕES DE DEPENDÊNCIAS

### Verificar vulnerabilidades:
```bash
npm audit
```

### Corrigir automaticamente:
```bash
npm audit fix
```

### Atualizar dependências regularmente:
```bash
npm outdated  # Ver quais estão desatualizadas
npm update    # Atualizar minor e patch versions
```

**Faça isso ANTES de fazer deploy em produção!**

---

## 6. CHECKLIST PRÉ-PRODUÇÃO

### Segurança:
- [ ] `.env` está em `.gitignore`?
- [ ] `.env` foi COMMITADO acidentalmente? (Se sim, regenere TODOS os tokens)
- [ ] `helmet` foi instalado e adicionado?
- [ ] Rate limiting foi configurado?
- [ ] CORS está restrito (não usa `*`)?
- [ ] Validação de entrada foi adicionada?
- [ ] Logs não expõem senhas?

### Código:
- [ ] `npm audit` sem vulnerabilidades críticas?
- [ ] `NODE_ENV=production` está configurado?
- [ ] Testou o servidor localmente com `npm start`?
- [ ] Testou o frontend funcionando com o backend?

### Banco de Dados:
- [ ] MongoDB Atlas whitelist permite o IP do servidor de produção?
- [ ] Backup está configurado no MongoDB Atlas?
- [ ] Senha do usuário MongoDB é forte?

### Deploy:
- [ ] Repositório GitHub está PRIVADO (se necessário)?
- [ ] Variáveis de ambiente estão configuradas na plataforma?
- [ ] HTTPS está ativado (automático em Render/Railway)?

---

## 7. EXEMPLO COMPLETO: server.js SEGURO PARA PRODUÇÃO

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const app = express();

// ============================================
// SEGURANÇA - MIDDLEWARE
// ============================================
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente mais tarde',
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============================================
// MONGODB
// ============================================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI não configurada!');
  process.exit(1);
}

console.log('🔌 Conectando ao MongoDB...');
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro:', err.message));

// ============================================
// SCHEMA
// ============================================
const filmeSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true, maxlength: 200 },
  status: { 
    type: String, 
    enum: ['Não assistido', 'Assistido'],
    default: 'Não assistido'
  },
  dataCriacao: { type: Date, default: Date.now }
});

const Filme = mongoose.model('Filme', filmeSchema);

// ============================================
// API SEGURA
// ============================================

// POST - Com validação
app.post('/api/filmes',
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 200 }).withMessage('Nome muito longo'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucesso: false, erros: errors.array() });
    }

    try {
      const filme = new Filme({ nome: req.body.nome });
      await filme.save();
      res.status(201).json({ sucesso: true, filme });
    } catch (err) {
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar filme' });
    }
  }
);

// GET - Listar filmes
app.get('/api/filmes', async (req, res) => {
  try {
    const filmes = await Filme.find().sort({ dataCriacao: -1 });
    res.json({ sucesso: true, filmes });
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar filmes' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    sucesso: true,
    servidor: 'Online',
    banco: isConnected ? 'Conectado' : 'Desconectado',
    ambiente: process.env.NODE_ENV
  });
});

// ============================================
// FALLBACK SPA
// ============================================
app.use((req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada' });
  }
});

// ============================================
// INICIALIZAÇÃO
// ============================================
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em porta ${PORT}`);
  console.log(`📍 Ambiente: ${NODE_ENV}`);
});
```

---

## 8. PRÓXIMOS PASSOS

### 1️⃣ **Adicione Helmet e Rate Limiting:**
```bash
npm install helmet express-rate-limit express-validator
```

### 2️⃣ **Atualize seu server.js** com o código acima

### 3️⃣ **Crie .env.example:**
```bash
cp .env .env.example
# Edite .env.example e remova as senhas reais
```

### 4️⃣ **Teste localmente:**
```bash
npm start
```

### 5️⃣ **Deploy no Render/Railway** com confiança! 🎉

---

## 9. RECURSOS ADICIONAIS

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Express Security:** https://expressjs.com/en/advanced/best-practice-security.html
- **Node.js Security:** https://nodejs.org/en/docs/guides/security/
- **MongoDB Security:** https://docs.mongodb.com/manual/security/

---

## ⚠️ REGRA DE OURO

**NUNCA exponha `MONGO_URI` em:**
- ❌ Código-fonte no GitHub
- ❌ Console logs
- ❌ Frontend (HTML/JavaScript)
- ❌ Comentários no código

**SEMPRE use variáveis de ambiente!**
