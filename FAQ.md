# ❓ FAQ - Perguntas Frequentes

## 🔧 Instalação e Setup

### P: Como verifico se Node.js está instalado?
**R:** Execute no terminal:
```bash
node --version
npm --version
```

Você deve ver números de versão (ex: v18.17.0).

---

### P: Recebo "command not found: npm"
**R:** Você precisa instalar Node.js:
1. Acesse https://nodejs.org/
2. Baixe a versão LTS
3. Instale seguindo o wizard
4. Reinicie o terminal/PowerShell
5. Tente novamente

---

### P: Onde fico as dependências depois que instalo?
**R:** Todas vão para a pasta `node_modules/` automaticamente. Adicione ao `.gitignore` para não versionar.

---

### P: Posso usar yarn ao invés de npm?
**R:** Sim! Use:
```bash
yarn install
yarn start
```

---

## 📦 MongoDB

### P: Preciso instalar MongoDB localmente?
**R:** Não, você tem 2 opções:
1. **Local**: Instale de https://www.mongodb.com/try/download/community
2. **Cloud**: Use MongoDB Atlas (grátis) em https://www.mongodb.com/cloud/atlas

Recomendamos MongoDB Atlas para desenvolvimento.

---

### P: Como conecto ao MongoDB Atlas?
**R:** 
1. Crie uma conta em https://www.mongodb.com/cloud/atlas
2. Crie um cluster (grátis)
3. Vá em "Connect" → "Drivers"
4. Copie a string de conexão
5. Cole no arquivo `.env`:
```env
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/sorteador_filmes
```

---

### P: Erro "cannot connect to MongoDB"
**R:** Verifique:
1. ✓ MongoDB está rodando (se local)
2. ✓ MONGO_URI está correto no `.env`
3. ✓ Rede permite conexão (firewalls, VPN)
4. ✓ Credenciais estão corretas (se cloud)

---

### P: Como verifico se MongoDB está rodando?
**R:** 
- **Windows**: Verifique Services (services.msc)
- **Mac**: `brew services list`
- **Linux**: `sudo systemctl status mongod`

---

### P: Posso deletar a base de dados?
**R:** Sim, mas terá que readicionar os filmes. No MongoDB Compass:
1. Clique com botão direito na collection
2. Selecione "Drop Collection"

---

## 🚀 Executando a Aplicação

### P: Como saber se o servidor está rodando?
**R:** Procure por estas mensagens:
```
✓ Conectado ao MongoDB
🚀 Servidor rodando em http://localhost:3000
```

Se ver erros, verifique o console.

---

### P: A aplicação não abre em http://localhost:3000
**R:** 
1. Confirme que o servidor está rodando
2. Tente usar `127.0.0.1:3000` ao invés de `localhost`
3. Verifique se não tem firewall bloqueando

---

### P: Posso acessar de outro computador?
**R:** Sim! Use o IP da máquina:
```
http://192.168.1.100:3000
```

Certifique-se que o firewall permite conexões na porta 3000.

---

### P: Como parar o servidor?
**R:** No terminal, pressione `Ctrl + C`

---

## 💾 Dados e Funcionalidades

### P: Onde meus dados são salvos?
**R:** No MongoDB especificado na variável `MONGO_URI` do `.env`.

Se usar MongoDB local, será em:
- **Windows**: `C:\data\db\`
- **Mac/Linux**: `/data/db/`

Se usar MongoDB Atlas, será na nuvem.

---

### P: Posso ter filmes com nomes duplicados?
**R:** Não! O sistema valida e retorna erro 409. Exemplo:
```
Erro: "Este filme já existe no banco de dados"
```

---

### P: O filme sorteado pode ser um já assistido?
**R:** Não! O sorteador busca **apenas** filmes com status "Não assistido".

Se todos os filmes já foram assistidos, recebe:
```
"🎬 Nenhum filme disponível para sortear!"
```

---

### P: Posso renomear um filme?
**R:** No momento, não. Você pode:
1. Remover o filme
2. Adicionar com o novo nome

Mas estamos planejando adicionar este recurso em futuras versões.

---

### P: Meus dados desaparecem quando reinicio o servidor?
**R:** Não! Seus dados estão salvos no MongoDB. Quando reiniciar, eles estarão lá.

---

## 🎨 Interface

### P: Por que o design é dark?
**R:** Design inspirado no template Agenciy da Framer. É moderno, reduz fadiga ocular e fica profissional.

---

### P: Posso mudar as cores?
**R:** Sim! No `index.html`, procure por `:root` no `<style>`:
```css
:root {
  --accent-primary: #8b5cf6;  /* Roxo atual */
  --accent-hover: #a78bfa;    /* Roxo hover */
}
```

Mude para qualquer cor que desejar!

---

### P: A interface fica responsiva em mobile?
**R:** Sim! Foi desenvolvida com "mobile-first" em mente. Teste no navegador com F12.

---

## 🔒 Segurança

### P: A aplicação é segura?
**R:** Para desenvolvimento, sim! Implementamos:
- ✓ Validação de entrada
- ✓ Proteção contra XSS
- ✓ CORS configurado
- ✓ Mongoose schema validation

Para produção, adicione:
- Rate limiting
- JWT/OAuth
- HTTPS
- Proteção de variáveis de ambiente

---

### P: Minha senha de MongoDB fica exposta no `.env`?
**R:** Sim, por isso:
1. **NUNCA** commit `.env` em Git
2. Adicione ao `.gitignore` (já feito)
3. Para produção, use variáveis de ambiente do servidor

---

### P: Devo compartilhar o arquivo `.env`?
**R:** **NÃO!** Nunca compartilhe:
- Senhas
- Chaves de API
- URLs de banco de dados

Compartilhe `.env.example` e deixe a pessoa configurar seu próprio.

---

## 🐛 Debugging

### P: Como vejo os erros do servidor?
**R:** Observe o console onde rodou `npm start`. Erros aparecem ali em tempo real.

---

### P: Como debugo erros no frontend?
**R:** Abra DevTools (F12 no navegador) e veja:
- **Console**: Mensagens de erro do JavaScript
- **Network**: Requisições para a API
- **Application**: Dados armazenados

---

### P: A API retorna erro 500
**R:** Significa erro no servidor. Verifique:
1. Console do servidor
2. Conexão com MongoDB
3. Dados enviados estão válidos
4. Não há typos no código

---

### P: Estou recebendo erro CORS
**R:** O servidor já está configurado com CORS. Se ainda receber erro:
1. Confirme que o servidor está rodando
2. Tente limpar cache (Ctrl+Shift+Delete)
3. Abra DevTools para ver a mensagem exata

---

### P: Como ler o erro completo na API?
**R:** Abra DevTools → Network → Clique na requisição → Preview

---

## 📝 Desenvolvimento

### P: Como editar o código?
**R:** Abra a pasta do projeto em seu editor favorito:
```bash
code .
```

Qualquer alteração no `server.js` requer reiniciar:
1. Pressione Ctrl + C
2. Rode `npm start` novamente

---

### P: Como adicionar novas rotas?
**R:** No `server.js`, após as outras rotas:
```javascript
app.get('/api/nova-rota', async (req, res) => {
  // Sua lógica aqui
});
```

Reinicie o servidor!

---

### P: Posso adicionar autenticação?
**R:** Sim! Recomendamos:
1. JWT (JSON Web Tokens)
2. Passport.js
3. Auth0

Será necessário refatoração significativa.

---

## 📱 Deployment

### P: Como coloco em produção?
**R:** Você pode usar:
- **Heroku**: Plataforma simples (mas paga agora)
- **Railway**: Alternativa moderna
- **AWS/Azure**: Mais controle
- **DigitalOcean**: Bom custo-benefício

Recomendamos começar com Railway (grátis).

---

### P: Minha aplicação rodará no Heroku?
**R:** Sim, mas será necessário:
1. Criar `Procfile`
2. Configurar variáveis de ambiente
3. Usar banco MongoDB Atlas (não local)

---

## 📊 Performance

### P: A aplicação fica lenta com muitos filmes?
**R:** Para <10.000 filmes não há problema. Acima disso:
1. Implemente paginação
2. Adicione índices no MongoDB
3. Use cache (Redis)

---

### P: Como melhorar a performance?
**R:** 
1. Comprima assets (CSS, JS)
2. Use CDN para servir arquivos estáticos
3. Implemente caching no browser
4. Otimize queries do MongoDB

---

## 🆘 Ainda não resolvi meu problema!

Se você enfrentou um problema que não está listado:

1. **Verifique os logs** do servidor (console do terminal)
2. **Abra DevTools** (F12) e veja erros no navegador
3. **Leia a mensagem de erro** com atenção
4. **Pesquise o erro** no Google
5. **Pergunte em comunidades**: Stack Overflow, Reddit, GitHub Issues

---

**Sucesso no seu projeto!** 🚀

Se resolver um problema não listado aqui, considere adicionar ao FAQ para ajudar outros!
