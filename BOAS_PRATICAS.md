# ✅ Guia de Boas Práticas e Próximos Passos

Este documento fornece orientações sobre boas práticas, otimizações e como melhorar o projeto.

---

## 📋 Checklist de Boas Práticas

### Segurança ✓

- [x] **Validação no Backend**: Todas as entradas são validadas no servidor
- [x] **Proteção XSS**: HTML é escapado no frontend
- [x] **CORS Configurado**: Apenas as origens permitidas acessam a API
- [x] **Mongoose Validation**: Schema define tipos e restrições
- [x] **Sem dados sensíveis**: `.env` não é commitado

### Performance ✓

- [x] **CSS Embutido**: Reduz requisições HTTP
- [x] **Sem dependências desnecessárias**: Apenas Express, Mongoose, CORS
- [x] **Compressão**: Respostas JSON são pequenas
- [x] **Async/Await**: Não bloqueia thread principal

### Código ✓

- [x] **Comentários**: Código bem documentado
- [x] **Tratamento de Erros**: Try/catch em todas as rotas
- [x] **Nomes descritivos**: Variáveis e funções com nomes claros
- [x] **DRY Principle**: Sem código repetido
- [x] **Modularização**: Funções pequenas e reutilizáveis

### UX/UI ✓

- [x] **Design Responsivo**: Funciona em todos os tamanhos
- [x] **Acessibilidade**: Semântica HTML, labels, ARIA
- [x] **Feedback Visual**: Mensagens de sucesso/erro
- [x] **Animações Suaves**: Transições agradáveis
- [x] **Loading States**: Usuário sabe que algo está acontecendo

### Documentação ✓

- [x] **README.md**: Instruções de instalação
- [x] **API Docs**: Exemplos de requisições
- [x] **FAQ.md**: Perguntas frequentes respondidas
- [x] **ARQUITETURA.md**: Explicação técnica

---

## 🔄 Possíveis Melhorias

### Curto Prazo (Semana 1)

```javascript
// 1. RATE LIMITING - Evitar abuso
npm install express-rate-limit

// server.js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use('/api/', limiter);
```

---

```javascript
// 2. INPUT SANITIZATION - Remover caracteres perigosos
npm install express-validator

// server.js
const { body, validationResult } = require('express-validator');

app.post('/api/filmes', [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 1, max: 100 }).withMessage('Nome muito longo')
    .escape() // Remove caracteres perigosos
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... resto do código
});
```

---

```javascript
// 3. LOGGING - Rastrear eventos
npm install morgan

// server.js
const morgan = require('morgan');
app.use(morgan('combined')); // Logs detalhados de requisições
```

---

```javascript
// 4. ENVIRONMENT VARIABLES - Separar dev/prod
// .env
NODE_ENV=production
LOG_LEVEL=info
CACHE_TTL=3600
```

---

### Médio Prazo (2-4 Semanas)

```javascript
// 5. AUTENTICAÇÃO COM JWT
npm install jsonwebtoken bcryptjs

// Adicionar schema de usuário
const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  criado: { type: Date, default: Date.now }
});

// Hash de senha
const bcrypt = require('bcryptjs');
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  const usuario = await Usuario.findOne({ email: req.body.email });
  if (!usuario || !await bcrypt.compare(req.body.senha, usuario.senha)) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }
  
  const token = jwt.sign(
    { id: usuario._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ token });
});
```

---

```javascript
// 6. MIDDLEWARE DE AUTENTICAÇÃO
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token ausente' });
  
  try {
    req.usuarioId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch (erro) {
    res.status(401).json({ erro: 'Token inválido' });
  }
};

// Proteger rotas
app.post('/api/filmes', verificarToken, async (req, res) => {
  // Apenas usuários autenticados
});
```

---

```javascript
// 7. PAGINAÇÃO - Para listas grandes
app.get('/api/filmes', async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = parseInt(req.query.limite) || 10;
  const skip = (pagina - 1) * limite;
  
  const filmes = await Filme.find()
    .skip(skip)
    .limit(limite)
    .sort({ createdAt: -1 });
  
  const total = await Filme.countDocuments();
  
  res.json({
    pagina,
    limite,
    total,
    paginas: Math.ceil(total / limite),
    filmes
  });
});
```

---

```javascript
// 8. BUSCA/FILTRO AVANÇADO
app.get('/api/filmes/buscar', async (req, res) => {
  const { busca, status, ordenar } = req.query;
  
  const filtro = {};
  if (busca) {
    filtro.nome = new RegExp(busca, 'i');
  }
  if (status) {
    filtro.status = status;
  }
  
  const ordem = ordenar === 'antigos' ? 1 : -1;
  
  const filmes = await Filme.find(filtro).sort({ createdAt: ordem });
  
  res.json({ filmes });
});
```

---

### Longo Prazo (1-3 Meses)

```javascript
// 9. UPLOAD DE IMAGENS - Pôsteres de filmes
npm install multer sharp

const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/filmes/poster/:id', upload.single('poster'), async (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Arquivo não enviado' });
  
  // Processar imagem
  const filename = `${req.params.id}.webp`;
  await sharp(req.file.buffer)
    .resize(300, 450, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join('public/posters', filename));
  
  // Salvar referência no BD
  await Filme.findByIdAndUpdate(req.params.id, {
    poster: `/posters/${filename}`
  });
  
  res.json({ sucesso: true, url: `/posters/${filename}` });
});
```

---

```javascript
// 10. INTEGRAÇÃO COM TMDB API - Dados de filmes reais
npm install axios

const axios = require('axios');
const TMDB_API = 'https://api.themoviedb.org/3';

app.get('/api/filmes/info/:nome', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_API}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: req.params.nome
      }
    });
    
    const filme = response.data.results[0];
    res.json({
      titulo: filme.title,
      sinopse: filme.overview,
      poster: `https://image.tmdb.org/t/p/w500${filme.poster_path}`,
      voto: filme.vote_average
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});
```

---

## 🚀 Deployment

### Heroku

```bash
# 1. Criar Procfile
echo "web: node server.js" > Procfile

# 2. Adicionar start script no package.json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

# 3. Deploy
heroku create seu-app
git push heroku main

# 4. Variáveis de ambiente
heroku config:set MONGO_URI=seu_mongodb_uri
heroku config:set NODE_ENV=production
```

---

### Railway

```bash
# 1. Conectar repositório GitHub
# 2. Criar projeto no Railway
# 3. Conectar MongoDB
# 4. Deploy automático no push
```

---

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGO_URI: mongodb://mongo:27017/sorteador
    depends_on:
      - mongo
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
```

---

## 📊 Monitoramento em Produção

```javascript
// npm install sentry
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());

// Agora erros em produção são rastreados
```

---

## 🧪 Testes Automatizados

```javascript
// npm install jest supertest --save-dev

// tests/api.test.js
const request = require('supertest');
const app = require('../server');

describe('API Filmes', () => {
  test('POST /api/filmes - Adiciona filme', async () => {
    const res = await request(app)
      .post('/api/filmes')
      .send({ nome: 'Matrix' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.sucesso).toBe(true);
  });
  
  test('GET /api/filmes - Lista filmes', async () => {
    const res = await request(app).get('/api/filmes');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.filmes)).toBe(true);
  });
});

// package.json
"scripts": {
  "test": "jest --coverage"
}
```

---

## 🎨 Melhorias de UI/UX

```html
<!-- Adicionar avaliações -->
<div class="filme-rating">
  <span class="stars">★★★★☆</span>
  <span class="nota">(4.5/5)</span>
</div>

<!-- Adicionar tags/gêneros -->
<div class="filme-generos">
  <span class="tag">Ficção Científica</span>
  <span class="tag">Ação</span>
</div>

<!-- Modo escuro/claro toggle -->
<button class="theme-toggle">☀️/🌙</button>

<!-- Atalhos de teclado -->
<div class="shortcuts">
  <p>Enter: Adicionar filme</p>
  <p>Ctrl+Enter: Sortear</p>
  <p>ESC: Fechar modal</p>
</div>
```

---

## 🔧 Developer Experience

```bash
# Adicionar Nodemon para reload automático
npm install --save-dev nodemon

# package.json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

# Usar ESLint para qualidade de código
npm install --save-dev eslint

# Usar Prettier para formatação
npm install --save-dev prettier
```

---

## 📚 Estrutura Escalável

```
sorteador_filmes/
├── src/
│   ├── controllers/
│   │   └── filmeController.js
│   ├── models/
│   │   └── Filme.js
│   ├── routes/
│   │   └── filmes.js
│   ├── middleware/
│   │   └── auth.js
│   └── utils/
│       └── validators.js
├── tests/
│   └── api.test.js
├── public/
│   └── index.html
├── config/
│   └── database.js
└── server.js
```

---

## 🎯 Roadmap de Desenvolvimento

```
Q1 2025:
├─ Implementar autenticação JWT
├─ Adicionar rate limiting
└─ Publicar em produção (Railway)

Q2 2025:
├─ Integração TMDB API
├─ Upload de pôsteres
└─ Sistema de avaliações

Q3 2025:
├─ Aplicativo mobile (React Native)
├─ Real-time com WebSockets
└─ Sistema de recomendações

Q4 2025:
├─ Machine Learning para sugestões
├─ Integração com streaming
└─ Comunidade/Compartilhamento
```

---

## 📖 Recursos de Aprendizado

### Cursos Recomendados
- MongoDB University: M001
- The Net Ninja: Express Course
- freeCodeCamp: Node.js Full Course
- Frontend Masters: JavaScript

### Documentação
- Express: https://expressjs.com
- Mongoose: https://mongoosejs.com
- MDN Web Docs: https://developer.mozilla.org

### Comunidades
- Stack Overflow
- Dev.to
- Reddit: r/javascript, r/node, r/webdev
- Discord: Node.js, The Odin Project

---

## ✨ Conclusão

Este é um projeto robusto e bem estruturado. Com as melhorias sugeridas, pode crescer para uma aplicação profissional em produção!

**Próximos passos:**
1. ✅ Testar localmente
2. ✅ Deploy em staging
3. ✅ Adicionar testes
4. ✅ Implementar autenticação
5. ✅ Publicar em produção
6. ✅ Coletar feedback
7. ✅ Iterar e melhorar

---

**Bom desenvolvimento!** 🚀
