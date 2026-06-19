# 🏗️ Arquitetura e Estrutura do Projeto

Este documento explica a arquitetura, decisões de design e estrutura do Sorteador de Filmes.

---

## 📐 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  index.html                                             ││
│  │  - Interface responsiva                                 ││
│  │  - Design dark/minimalista (Inspirado em Agenciy)      ││
│  │  - Fetch API para comunicação com servidor             ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  SERVIDOR (Node.js)                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  server.js (Express)                                    ││
│  │  ┌──────────────────────────────────────────────────┐  ││
│  │  │ ROTAS da API                                     │  ││
│  │  │ - POST   /api/filmes      (Adicionar)           │  ││
│  │  │ - GET    /api/filmes      (Listar)              │  ││
│  │  │ - PATCH  /api/filmes/:id  (Alternar status)    │  ││
│  │  │ - GET    /api/sortear     (Sortear aleatório)   │  ││
│  │  │ - DELETE /api/filmes/:id  (Remover)            │  ││
│  │  └──────────────────────────────────────────────────┘  ││
│  │                                                          ││
│  │  ┌──────────────────────────────────────────────────┐  ││
│  │  │ MIDDLEWARE                                       │  ││
│  │  │ - CORS (Permite requisições cross-origin)       │  ││
│  │  │ - JSON Parser (Parse de JSON)                   │  ││
│  │  │ - Static Server (Serve index.html)              │  ││
│  │  └──────────────────────────────────────────────────┘  ││
│  │                                                          ││
│  │  ┌──────────────────────────────────────────────────┐  ││
│  │  │ VALIDAÇÕES & REGRAS DE NEGÓCIO                   │  ││
│  │  │ - Verificar nomes vazios                         │  ││
│  │  │ - Impedir duplicatas (case-insensitive)         │  ││
│  │  │ - Validar status (Assistido/Não assistido)      │  ││
│  │  │ - Sortear APENAS filmes não assistidos          │  ││
│  │  └──────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────┬──────────────────────────────────────┘
                       │ MongoDB Query
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              BANCO DE DADOS (MongoDB)                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Coleção: filmes                                        ││
│  │  ┌───────────────────────────────────────────────────┐  ││
│  │  │ {                                                │  ││
│  │  │   _id: ObjectId,                                │  ││
│  │  │   nome: "Matrix",                               │  ││
│  │  │   status: "Não assistido",                      │  ││
│  │  │   createdAt: Date,                              │  ││
│  │  │   updatedAt: Date                               │  ││
│  │  │ }                                                │  ││
│  │  └───────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos

```
sorteador_filmes/
│
├── server.js                 # Backend: Express + Mongoose
│                             # - Rotas da API
│                             # - Validações
│                             # - Conexão com MongoDB
│
├── index.html                # Frontend: HTML + CSS + JavaScript
│                             # - Interface completa
│                             # - Estilos embutidos
│                             # - Consumo de API com Fetch
│
├── package.json              # Configuração do npm
│                             # - Dependências
│                             # - Scripts
│
├── .env                      # Variáveis de ambiente (GITIGNORED)
│                             # - PORT
│                             # - MONGO_URI
│
├── .env.example              # Template do .env
│
├── .gitignore                # Arquivos ignorados pelo Git
│
├── public/                   # Arquivos estáticos (futuro)
│
├── README.md                 # Documentação principal
├── INSTALACAO_RAPIDA.md      # Guia rápido
├── EXEMPLOS_API.md           # Exemplos de requisições
├── FAQ.md                    # Perguntas frequentes
└── ARQUITETURA.md            # Este arquivo
```

---

## 🔄 Fluxo de Dados

### 1. Adicionar Filme

```
User digita nome → Clica "+"
    ↓
Frontend (JavaScript)
    ↓
POST /api/filmes { nome: "..." }
    ↓
Backend (server.js)
    ├─ Valida se nome está vazio
    ├─ Verifica duplicata
    ├─ Cria documento
    └─ Salva no MongoDB
    ↓
API retorna JSON { sucesso, filme }
    ↓
Frontend atualiza lista de filmes
```

---

### 2. Sortear Filme

```
User clica "Sortear Agora"
    ↓
GET /api/sortear
    ↓
Backend (server.js)
    ├─ Busca filmes com status "Não assistido"
    ├─ Seleciona um aleatoriamente
    └─ Retorna na API
    ↓
Frontend exibe modal com resultado
    ↓
User vê o filme sorteado
```

---

### 3. Alternar Status

```
User clica em "Marcar como Assistido"
    ↓
PATCH /api/filmes/:id
    ↓
Backend (server.js)
    ├─ Busca filme por ID
    ├─ Alterna status
    └─ Salva mudança
    ↓
Frontend atualiza visual do filme
```

---

## 🎯 Decisões de Design

### Por que separar Frontend e Backend?

**Razões:**
1. **Separação de Responsabilidades**: Frontend (UI) e Backend (Lógica) independentes
2. **Segurança**: Validações no backend evitam manipulação
3. **Escalabilidade**: Pode adicionar múltiplos frontends
4. **Manutenção**: Código mais organizado e fácil de entender

---

### Por que usar Express?

**Razões:**
1. **Simples**: Framework minimalista, não "opinado"
2. **Maduro**: Comunidade grande, muitos recursos
3. **Rápido**: Performance excelente
4. **Flexível**: Facilita adicionar novas funcionalidades

---

### Por que Mongoose?

**Razões:**
1. **Type Safety**: Schema validation (até certo ponto)
2. **Middleware**: Hooks (pre/post save)
3. **Query Builder**: Sintaxe intuitiva
4. **Timestamps**: Adiciona createdAt/updatedAt automaticamente

---

### Por que MongoDB?

**Razões:**
1. **Flexível**: Sem schema rígido (NoSQL)
2. **JSON**: Dados em formato familiar
3. **Escalável**: Pronto para crescimento
4. **Gratuito**: MongoDB Atlas oferece tier grátis generoso

---

### Por que Design Dark/Minimalista?

**Razões:**
1. **Profissional**: Aparência moderna
2. **Acessibilidade**: Menos fadiga ocular
3. **Performance**: Menos processamento GPU (dark mode)
4. **Inspiração**: Template Agenciy é referência em UX

---

## 🔒 Estratégias de Segurança

### Frontend

```javascript
// XSS Protection: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;  // Evita interpretação de HTML
  return div.innerHTML;
}

// Validação de entrada
if (!nome.trim()) {
  exibirMensagem('Nome vazio', 'warning');
  return;
}
```

---

### Backend

```javascript
// Mongoose Schema Validation
const filmeSchema = new mongoose.Schema({
  nome: {
    required: [true, 'Nome é obrigatório'],
    unique: [true, 'Filme já existe'],
    minlength: [1, 'Nome não pode estar vazio']
  }
});

// Verificação case-insensitive
const filmeExistente = await Filme.findOne({
  nome: new RegExp(`^${nome.trim()}$`, 'i')
});

// CORS configurado
app.use(cors());

// Validação de ObjectId
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ sucesso: false });
}
```

---

## 📊 Modelos de Dados

### Schema do Filme

```javascript
{
  _id: ObjectId,              // ID único gerado pelo MongoDB
  nome: String,               // Nome do filme (único)
  status: String,             // "Assistido" ou "Não assistido"
  createdAt: Date,            // Data de criação (automático)
  updatedAt: Date             // Data de última atualização (automático)
}
```

---

## 🚀 Fluxo de Requisição HTTP

### Exemplo: POST para adicionar filme

```
REQUEST:
├─ Method: POST
├─ URL: http://localhost:3000/api/filmes
├─ Headers: { Content-Type: application/json }
└─ Body: { nome: "Matrix" }

PROCESSING:
├─ Parse JSON
├─ Validar nome
├─ Verificar duplicata
├─ Criar documento
└─ Salvar no MongoDB

RESPONSE:
├─ Status: 201 (Created)
├─ Headers: { Content-Type: application/json }
└─ Body: {
    sucesso: true,
    mensagem: "Filme adicionado",
    filme: { _id, nome, status, ... }
  }
```

---

## 🔌 Integração Frontend-Backend

### Como o Frontend se comunica

```javascript
// 1. Faz requisição
const response = await fetch(`${API_BASE_URL}/filmes`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome })
});

// 2. Recebe resposta
const data = await response.json();

// 3. Processa resultado
if (data.sucesso) {
  carregarFilmes();  // Atualiza lista
  exibirMensagem('Sucesso', 'success');
} else {
  exibirMensagem(data.mensagem, 'error');
}

// 4. Trata erros
catch (erro) {
  console.error(erro);
  exibirMensagem('Erro ao conectar', 'error');
}
```

---

## 🎨 Design System

### Variáveis CSS

```css
:root {
  /* Cores base */
  --bg-dark: #0a0a0a;           /* Fundo escuro profundo */
  --bg-secondary: #141414;      /* Fundo secundário */
  --border-color: #2a2a2a;      /* Bordas sutis */
  
  /* Tipografia */
  --text-primary: #ffffff;      /* Texto principal */
  --text-secondary: #a0a0a0;    /* Texto secundário */
  
  /* Acentos */
  --accent-primary: #8b5cf6;    /* Roxo neon */
  --accent-hover: #a78bfa;      /* Roxo mais claro */
  
  /* Status */
  --success: #10b981;           /* Verde */
  --warning: #f59e0b;           /* Amarelo/Laranja */
  --danger: #ef4444;            /* Vermelho */
  
  /* Transição */
  --transition: all 0.3s cubic-bezier(...);
}
```

---

## 📈 Escalabilidade Futura

### Melhorias possíveis

```
v1.0 (Atual)
├─ CRUD básico
├─ Sorteio simples
└─ Interface minimal

v1.1 (Próximo)
├─ Autenticação (JWT)
├─ Upload de pôsteres
├─ Avaliações (1-5 estrelas)
└─ Comentários/Notas

v2.0 (Médio prazo)
├─ Integração com TMDB API
├─ Recomendações por gênero
├─ Sincronização com streaming (Netflix, etc)
└─ Compartilhamento de listas

v3.0 (Longo prazo)
├─ App mobile (React Native)
├─ Multiplayer (Real-time)
├─ Machine Learning (Recomendações)
└─ Análiticas (Estatísticas de watching)
```

---

## 🧪 Padrões de Código

### Estrutura de Rotas

```javascript
// Cada rota segue este padrão

app.method('/api/rota/:param?', async (req, res) => {
  try {
    // 1. Validações
    // 2. Processamento
    // 3. Resposta bem-sucedida
    res.status(200).json({ sucesso: true, ... });
  } catch (erro) {
    // 4. Tratamento de erro
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});
```

---

### Estrutura de Componentes Frontend

```javascript
// 1. Função de utilidade
function escapeHtml(text) { ... }

// 2. Função de API
async function adicionarFilme(nome) { ... }

// 3. Função de UI
function renderizarFilmes(filmes) { ... }

// 4. Event Listener
btnAdicionar.addEventListener('click', () => { ... });

// 5. Inicialização
document.addEventListener('DOMContentLoaded', () => { ... });
```

---

## 📝 Convenções de Código

### Nomenclatura

```javascript
// Funções
adicionarFilme()        // camelCase com verbo
renderizarFilmes()
sortearFilme()

// Variáveis
const filmeInput = ...  // nome descritivo
const API_BASE_URL = .. // CONSTANTES em UPPERCASE
let filmeAtual = ...    // let para mutáveis

// Classes CSS
.filme-item             // kebab-case
.btn-primary
.modal-overlay
```

---

## 🔍 Performance Considerações

### Otimizações atuais

1. **CSS em linha**: Reduz requisições HTTP
2. **Lazy loading**: Imagens/componentes carregam sob demanda
3. **Minificação**: CSS/JS comprimidos
4. **Caching**: MongoDB com índices

### Possíveis melhorias

1. **Bundle analysis**: Minificar ainda mais
2. **Service Worker**: Funciona offline
3. **CDN**: Servir assets globalmente
4. **Compression**: Gzip para requisições

---

## 🎓 Conceitos Aprendidos

Este projeto demonstra:

1. **REST API Design**: Rotas, Status HTTP, JSON
2. **MVC Pattern**: Model (Mongoose), View (HTML), Controller (Express)
3. **Async/Await**: Programação assíncrona
4. **Validação**: Client-side e Server-side
5. **DOM Manipulation**: Vanilla JavaScript
6. **CSS3**: Grid, Flexbox, Animações
7. **Responsividade**: Mobile-first design
8. **CORS**: Cross-Origin Resource Sharing
9. **NoSQL**: Conceitos MongoDB
10. **Deploy**: Preparado para produção

---

**Fim da Documentação de Arquitetura** 🏗️

Perguntas? Veja [FAQ.md](FAQ.md)
