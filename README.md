# 🎬 Sorteador de Filmes

Aplicação web minimalista para gerenciar sua lista de filmes e sortear aleatoriamente qual assistir. Sem backend, sem banco de dados — tudo roda no navegador.

![Status](https://img.shields.io/badge/status-pronto-8b5cf6) ![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-0a0a0a)

---

## ✨ Funcionalidades

- **Adicionar filmes** com validação de campo vazio e bloqueio de duplicatas (case-insensitive)
- **Listar** com filtros rápidos: Todos / Não Assistidos / Assistidos
- **Alternar status** (assistido / não assistido) com um clique
- **Excluir** filmes da lista
- **Sortear** um filme aleatório entre os não assistidos, com feedback visual em modal
- **Persistência local**: tudo é salvo no `localStorage` do navegador — seus dados não saem da sua máquina

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (Variáveis CSS, Flexbox/Grid, animações)
- JavaScript Vanilla (ES6+), sem frameworks ou dependências externas

Nenhuma instalação, build step ou servidor é necessária.

## 📁 Estrutura do projeto

```
sorteador-de-filmes/
└── index.html   # HTML + CSS + JS, tudo em um único arquivo
```

## 🚀 Como rodar localmente

Basta abrir o arquivo no navegador:

```bash
# Opção 1: abrir direto
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux

# Opção 2: servir localmente (opcional, útil para evitar restrições de file://)
npx serve .
# ou
python3 -m http.server 8080
```

## 🌐 Deploy (custo zero)

Por não ter backend, o projeto pode ser hospedado em qualquer serviço de arquivos estáticos:

### GitHub Pages
1. Suba o repositório no GitHub
2. Vá em **Settings → Pages**
3. Selecione a branch (ex: `main`) e a pasta raiz (`/`)
4. Pronto — a URL será `https://seu-usuario.github.io/seu-repo/`

### Vercel
1. Importe o repositório em [vercel.com/new](https://vercel.com/new)
2. Nenhuma configuração de build é necessária (é HTML estático)
3. Deploy automático a cada push

### Netlify
1. Arraste a pasta do projeto em [app.netlify.com/drop](https://app.netlify.com/drop), ou conecte o repositório
2. Build command: vazio | Publish directory: `/`

## 💾 Sobre a persistência de dados

Os filmes cadastrados ficam salvos no `localStorage` do navegador, sob a chave `sorteador-filmes:v1`. Isso significa:

- Os dados **não são sincronizados** entre dispositivos ou navegadores diferentes
- Limpar o cache/dados do site apaga a lista
- Não há coleta nem envio de dados a servidores externos — tudo é 100% local e privado

## 🎨 Design

| Token | Valor |
|---|---|
| Fundo | `#0a0a0a` |
| Destaque (roxo neon) | `#8b5cf6` |
| Texto principal | `#ffffff` |
| Texto secundário | `#9a9aa2` |

Inspirado em interfaces minimalistas modernas, com cantos arredondados, glow sutil nos botões de ação e transições suaves. Totalmente responsivo (mobile e desktop).

## 🧩 Possíveis melhorias futuras

- Edição do nome de um filme já cadastrado
- Categorias/gêneros e filtro por gênero
- Exportar/importar a lista em JSON
- Modo de "sorteio ponderado" (favoritos com mais chance de serem sorteados)

## 📄 Licença

Livre para uso, modificação e distribuição.
