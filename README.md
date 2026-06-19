# 🎬 Sorteador de Filmes Compartilhado

Uma aplicação web para criar listas compartilhadas de filmes, sincronizadas em tempo real, permitindo que amigos, casais ou grupos organizem o que assistir e realizem sorteios aleatórios entre os filmes disponíveis.

## ✨ Funcionalidades

### 🔐 Autenticação

* Login com e-mail e senha
* Cadastro de novos usuários
* Login com Google
* Persistência de sessão

### 👥 Listas Compartilhadas

* Criação de listas através de código único
* Entrada em listas existentes utilizando código
* Sincronização em tempo real entre todos os participantes
* Alterações instantâneas para todos os usuários conectados

### 🎥 Gerenciamento de Filmes

* Adicionar filmes à lista
* Remover filmes da lista
* Evitar duplicidade de filmes
* Busca automática de pôsteres através da API do TMDB
* Pesquisa por nome do filme
* Filtros de visualização

### 📋 Filtros Disponíveis

* Todos os filmes
* Não assistidos
* Assistidos

### 🎲 Sorteio Inteligente

* Sorteia apenas filmes não assistidos
* Animação de suspense estilo roleta
* Exibição do pôster do filme sorteado
* Modal com destaque para o filme escolhido

### ☁️ Sincronização em Tempo Real

Todas as alterações são armazenadas no Firebase Firestore e sincronizadas automaticamente para todos os participantes da lista.

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript (ES Modules)

### Backend / Serviços

* Firebase Authentication
* Firebase Firestore
* TMDB API

### APIs

* The Movie Database (TMDB)

---

## 📂 Estrutura Atual

```text
index.html
```

Todo o projeto está concentrado em um único arquivo contendo:

* Interface
* Estilos
* Integração Firebase
* Integração TMDB
* Regras de negócio

---

## ⚙️ Configuração do Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

### 2. Criar projeto no Firebase

Acesse:

https://console.firebase.google.com

Configure:

* Authentication
* Firestore Database

### 3. Habilitar autenticação

No Firebase Authentication:

* Email/Senha
* Google

### 4. Configurar Firestore

Estrutura utilizada:

```text
lists
 └── CODIGO_DA_LISTA
      └── movies
           └── FILME
```

Documento de filme:

```json
{
  "title": "Interestelar",
  "watched": false,
  "posterUrl": "https://...",
  "createdAt": "timestamp"
}
```

### 5. Configurar API do TMDB

Crie uma conta:

https://www.themoviedb.org

Gere uma API Key e substitua:

```javascript
const TMDB_API_KEY = "SUA_API_KEY";
```

---

## 🚀 Executando o Projeto

Como o projeto utiliza módulos JavaScript, recomenda-se executar através de um servidor local.

Exemplo com VS Code:

1. Instale a extensão Live Server.
2. Clique em "Open with Live Server".

Ou:

```bash
python -m http.server 8000
```

Acesse:

```text
http://localhost:8000
```

---

## 🔮 Melhorias Futuras

### Sistema de Avaliações

Cada usuário poderá atribuir uma nota:

```json
{
  "ratings": {
    "uid1": 5,
    "uid2": 4,
    "uid3": 5
  }
}
```

Com cálculo automático da média.

### Modal de Informações

Exibir:

* Sinopse
* Gêneros
* Ano de lançamento
* Duração
* Nota TMDB
* Avaliações dos participantes

### Comentários

Sistema de comentários compartilhados por filme.

### Status Avançados

Substituir:

```json
{
  "watched": true
}
```

por:

```json
{
  "status": "watched"
}
```

Possíveis status:

* unwatched
* watching
* watched
* abandoned

### Refatoração

Separação em módulos:

```text
src/
├── css/
│   └── styles.css
├── js/
│   ├── firebase.js
│   ├── auth.js
│   ├── movies.js
│   ├── ui.js
│   └── tmdb.js
└── index.html
```

---

## 📸 Capturas de Tela

Adicione aqui imagens da aplicação em funcionamento.

```markdown
![Tela Principal](./screenshots/home.png)
![Sorteio](./screenshots/draw.png)
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo e uso pessoal.

---

## 👨‍💻 Autor

Lucas Alves Lougon

GitHub:
https://github.com/LucasAlvesLougon
