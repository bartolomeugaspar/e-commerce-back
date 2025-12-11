# E-Commerce API

API backend para plataforma de e-commerce TechNova, construída com Node.js, Express e pronta para deploy na Vercel.

## Características

- ✅ Autenticação com JWT
- ✅ Login com Google e GitHub
- ✅ Gerenciamento de produtos
- ✅ Carrinho de compras
- ✅ Gerenciamento de pedidos
- ✅ Perfil de usuário
- ✅ Pronto para Vercel

## Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup Local

```bash
# Clonar repositório
git clone <repository-url>
cd e-commerce-back

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com suas variáveis
nano .env

# Executar servidor
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

## Variáveis de Ambiente

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/google` - Login com Google
- `POST /api/auth/github` - Login com GitHub
- `POST /api/auth/verify` - Verificar token JWT

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter detalhes do produto
- `GET /api/products/categories/list` - Listar categorias
- `POST /api/products` - Criar novo produto (admin)

### Usuários
- `GET /api/users/:id` - Obter perfil do usuário
- `PUT /api/users/:id` - Atualizar perfil
- `GET /api/users` - Listar todos os usuários (admin)

### Pedidos
- `GET /api/orders` - Listar todos os pedidos (admin)
- `GET /api/orders/user/:userId` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter detalhes do pedido
- `POST /api/orders` - Criar novo pedido
- `PUT /api/orders/:id` - Atualizar status do pedido (admin)

### Carrinho
- `GET /api/cart/:userId` - Obter carrinho
- `POST /api/cart/:userId/add` - Adicionar item ao carrinho
- `POST /api/cart/:userId/remove` - Remover item do carrinho
- `POST /api/cart/:userId/clear` - Limpar carrinho
- `PUT /api/cart/:userId/update` - Atualizar quantidade

## Deploy na Vercel

### 1. Preparar Repositório

```bash
# Inicializar git (se não estiver)
git init
git add .
git commit -m "Initial commit"
```

### 2. Push para GitHub

```bash
# Criar repositório no GitHub
# Adicionar remote
git remote add origin <github-url>
git push -u origin main
```

### 3. Deploy na Vercel

#### Opção A: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Opção B: Via Dashboard
1. Acessar https://vercel.com
2. Fazer login com GitHub
3. Clicar em "New Project"
4. Selecionar o repositório
5. Configurar variáveis de ambiente
6. Fazer deploy

### 4. Configurar Variáveis de Ambiente

No dashboard da Vercel:
1. Ir para Settings > Environment Variables
2. Adicionar todas as variáveis do `.env`
3. Fazer redeploy

## Estrutura do Projeto

```
e-commerce-back/
├── api/
│   └── index.js          # Arquivo principal da API
├── routes/
│   ├── auth.js           # Rotas de autenticação
│   ├── products.js       # Rotas de produtos
│   ├── users.js          # Rotas de usuários
│   ├── orders.js         # Rotas de pedidos
│   └── cart.js           # Rotas de carrinho
├── package.json
├── vercel.json           # Configuração Vercel
├── .env.example
└── README.md
```

## Próximos Passos

- [ ] Integrar com MongoDB
- [ ] Implementar autenticação OAuth real
- [ ] Adicionar validação de entrada
- [ ] Implementar rate limiting
- [ ] Adicionar testes unitários
- [ ] Implementar logging
- [ ] Adicionar documentação Swagger

## Licença

ISC
