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
// Helmet adiciona headers HTTP de segurança
app.use(helmet());

// Rate limiting - proteção contra brute force e DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS seguro - apenas aceita requisições de origem permitida
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '10kb' })); // Limita tamanho do payload

// Servir arquivos estáticos da pasta 'public' e a raiz do projeto
app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));

// ============================================
// CONFIGURAÇÃO DO MONGODB
// ============================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sorteador_filmes';

console.log('🔌 Tentando conectar ao MongoDB...');
console.log(`📍 URI: ${MONGO_URI.substring(0, 50)}...`); // Mostra apenas início da URI

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
  })
  .catch(err => {
    console.error('❌ ERRO ao conectar ao MongoDB:');
    console.error(`   Mensagem: ${err.message}`);
    console.error(`   Código: ${err.code}`);
    console.error('');
    console.error('⚠️  DICAS:');
    console.error('   1. Verifique se o MongoDB Atlas está acessível');
    console.error('   2. Confirme as credenciais no arquivo .env');
    console.error('   3. Verifique se o IP está na whitelist do Atlas');
    console.error('   4. Tente conectar localmente com: mongodb://localhost:27017/sorteador_filmes');
  });

// ============================================
// SCHEMA E MODELO DO FILME
// ============================================
const filmeSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do filme é obrigatório'],
      unique: [true, 'Este filme já existe no banco de dados'],
      trim: true,
      minlength: [1, 'O nome do filme não pode estar vazio'],
    },
    status: {
      type: String,
      enum: ['Não assistido', 'Assistido'],
      default: 'Não assistido',
    },
  },
  { timestamps: true }
);

const Filme = mongoose.model('Filme', filmeSchema);

// ============================================
// HEALTH CHECK (Diagnóstico)
// ============================================

/**
 * GET /api/health
 * Verifica o status do servidor e banco de dados
 * Use para diagnosticar problemas de conexão
 */
app.get('/api/health', (req, res) => {
  const mongooseConnected = mongoose.connection.readyState === 1;
  
  res.status(mongooseConnected ? 200 : 503).json({
    sucesso: mongooseConnected,
    status: mongooseConnected ? 'Servidor OK' : 'Banco de dados desconectado',
    servidor: {
      rodando: true,
      porta: process.env.PORT || 3000,
      ambiente: process.env.NODE_ENV || 'development',
    },
    banco_de_dados: {
      conectado: mongooseConnected,
      uri_parcial: process.env.MONGO_URI?.substring(0, 50) + '...',
    },
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// ROTAS DA API
// ============================================

/**
 * POST /api/filmes
 * Adiciona um novo filme ao banco de dados
 * Body: { nome: string }
 * Validações:
 *  - Nome não pode estar vazio
 *  - Nome não pode ser duplicado
 *  - Máximo 200 caracteres
 */
app.post('/api/filmes',
  // Validação com express-validator
  body('nome')
    .trim()
    .notEmpty().withMessage('O nome do filme não pode estar vazio')
    .isLength({ max: 200 }).withMessage('Nome não pode exceder 200 caracteres')
    .escape(), // Escapa caracteres HTML para prevenir XSS
  async (req, res) => {
  try {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros: errors.array()
      });
    }

    const { nome } = req.body;

    // Verifica se o filme já existe (case-insensitive)
    const filmeExistente = await Filme.findOne({
      nome: new RegExp(`^${nome.trim()}$`, 'i'),
    });

    if (filmeExistente) {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'Este filme já existe no banco de dados',
      });
    }

    // Cria e salva o novo filme
    const novoFilme = new Filme({
      nome: nome.trim(),
      status: 'Não assistido',
    });

    await novoFilme.save();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Filme adicionado com sucesso',
      filme: novoFilme,
    });
  } catch (erro) {
    console.error('Erro ao adicionar filme:', erro.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao adicionar filme',
      erro: process.env.NODE_ENV === 'production' ? 'Erro interno' : erro.message,
    });
  }
});

/**
 * GET /api/filmes
 * Retorna a lista completa de filmes cadastrados
 * Query param: ?status=Assistido|Não%20assistido (opcional, para filtrar)
 */
app.get('/api/filmes', async (req, res) => {
  try {
    const { status } = req.query;
    const filtro = status ? { status } : {};

    const filmes = await Filme.find(filtro).sort({ createdAt: -1 });

    res.status(200).json({
      sucesso: true,
      total: filmes.length,
      filmes,
    });
  } catch (erro) {
    console.error('Erro ao listar filmes:', erro.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar filmes',
      erro: process.env.NODE_ENV === 'production' ? 'Erro interno' : erro.message,
    });
  }
});

/**
 * PATCH /api/filmes/:id
 * Alterna o status do filme (Não assistido ↔ Assistido)
 * Params: id (ID do MongoDB)
 */
app.patch('/api/filmes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validação: ID válido do MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID de filme inválido',
      });
    }

    // Busca o filme
    const filme = await Filme.findById(id);

    if (!filme) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Filme não encontrado',
      });
    }

    // Alterna o status
    filme.status = filme.status === 'Assistido' ? 'Não assistido' : 'Assistido';
    await filme.save();

    res.status(200).json({
      sucesso: true,
      mensagem: `Status alterado para "${filme.status}"`,
      filme,
    });
  } catch (erro) {
    console.error('Erro ao alterar status do filme:', erro.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao alterar status do filme',
      erro: process.env.NODE_ENV === 'production' ? 'Erro interno' : erro.message,
    });
  }
});

/**
 * GET /api/filmes/sortear
 * REGRA DO SORTEADOR:
 * - Busca APENAS filmes com status "Não assistido"
 * - Seleciona um aleatoriamente
 * - Se não houver filmes elegíveis, retorna mensagem de aviso
 */
app.get('/api/sortear', async (req, res) => {
  try {
    // Busca todos os filmes não assistidos
    const filmesNaoAssistidos = await Filme.find({ status: 'Não assistido' });

    // Validação: há filmes elegíveis?
    if (filmesNaoAssistidos.length === 0) {
      return res.status(200).json({
        sucesso: false,
        mensagem: '🎬 Nenhum filme disponível para sortear! Adicione filmes com status "Não assistido".',
        filme: null,
      });
    }

    // Seleciona um filme aleatoriamente
    const indiceSorteado = Math.floor(Math.random() * filmesNaoAssistidos.length);
    const filmeSorteado = filmesNaoAssistidos[indiceSorteado];

    res.status(200).json({
      sucesso: true,
      mensagem: 'Filme sorteado com sucesso!',
      filme: filmeSorteado,
    });
  } catch (erro) {
    console.error('Erro ao sortear filme:', erro.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao sortear filme',
      erro: process.env.NODE_ENV === 'production' ? 'Erro interno' : erro.message,
    });
  }
});

/**
 * DELETE /api/filmes/:id
 * Remove um filme do banco de dados (funcionalidade extra)
 */
app.delete('/api/filmes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID de filme inválido',
      });
    }

    const filme = await Filme.findByIdAndDelete(id);

    if (!filme) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Filme não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Filme removido com sucesso',
    });
  } catch (erro) {
    console.error('Erro ao remover filme:', erro.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao remover filme',
      erro: process.env.NODE_ENV === 'production' ? 'Erro interno' : erro.message,
    });
  }
});

// ============================================
// FALLBACK PARA SPA (Single Page Application)
// ============================================
// Serve o index.html para qualquer rota não reconhecida
// Isso permite que rotas do cliente funcionem com refresh
app.use((req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ 
      sucesso: false, 
      mensagem: 'Rota não encontrada',
      path: req.path 
    });
  }
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
