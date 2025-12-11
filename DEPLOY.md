# Guia de Deploy na Vercel

## Pré-requisitos

- Conta GitHub
- Conta Vercel (gratuita)
- Repositório GitHub com o código

## Passo 1: Preparar o Repositório

### 1.1 Inicializar Git (se não estiver)

```bash
cd /home/kali/Documentos/e-commerce-back
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Criar Repositório no GitHub

1. Acessar https://github.com/new
2. Nome: `e-commerce-back`
3. Descrição: "API backend para plataforma e-commerce TechNova"
4. Deixar público ou privado conforme preferência
5. Clicar em "Create repository"

### 1.3 Push para GitHub

```bash
git remote add origin https://github.com/seu-usuario/e-commerce-back.git
git branch -M main
git push -u origin main
```

## Passo 2: Deploy na Vercel

### Opção A: Via Dashboard Vercel (Recomendado)

1. **Acessar Vercel**
   - Ir para https://vercel.com
   - Fazer login com GitHub

2. **Criar Novo Projeto**
   - Clicar em "New Project"
   - Selecionar o repositório `e-commerce-back`
   - Clicar em "Import"

3. **Configurar Projeto**
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: deixar em branco
   - Output Directory: deixar em branco
   - Clicar em "Continue"

4. **Adicionar Variáveis de Ambiente**
   - Clicar em "Environment Variables"
   - Adicionar cada variável:

   ```
   MONGODB_URI = sua_mongodb_uri
   JWT_SECRET = sua_chave_secreta_jwt
   CORS_ORIGIN = https://seu-frontend.vercel.app
   GOOGLE_CLIENT_ID = seu_google_client_id
   GOOGLE_CLIENT_SECRET = seu_google_client_secret
   GITHUB_CLIENT_ID = seu_github_client_id
   GITHUB_CLIENT_SECRET = seu_github_client_secret
   ```

5. **Deploy**
   - Clicar em "Deploy"
   - Aguardar conclusão

### Opção B: Via Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Seguir as instruções do CLI
# - Selecionar o projeto
# - Configurar variáveis de ambiente
# - Confirmar deploy
```

## Passo 3: Configurar Variáveis de Ambiente

### Gerar JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Obter Credenciais Google OAuth

1. Acessar https://console.cloud.google.com
2. Criar novo projeto
3. Ativar Google+ API
4. Criar credenciais OAuth 2.0
5. Copiar Client ID e Client Secret

### Obter Credenciais GitHub OAuth

1. Acessar https://github.com/settings/developers
2. Criar nova OAuth App
3. Authorization callback URL: `https://seu-api.vercel.app/api/auth/github/callback`
4. Copiar Client ID e Client Secret

### Configurar MongoDB

Opções:
- MongoDB Atlas (gratuito): https://www.mongodb.com/cloud/atlas
- MongoDB Community (local): https://www.mongodb.com/try/download/community

## Passo 4: Testar a API

Após o deploy, testar os endpoints:

```bash
# Health check
curl https://seu-api.vercel.app/api/health

# Listar produtos
curl https://seu-api.vercel.app/api/products

# Login
curl -X POST https://seu-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Passo 5: Conectar Frontend

Atualizar o frontend para usar a URL da API:

```javascript
// .env.local do frontend
VITE_API_URL=https://seu-api.vercel.app/api
```

## Troubleshooting

### Erro: "Cannot find module"

Solução: Instalar dependências
```bash
npm install
```

### Erro: "CORS error"

Solução: Verificar CORS_ORIGIN nas variáveis de ambiente

### Erro: "MongoDB connection failed"

Solução: Verificar MONGODB_URI e permissões de IP no MongoDB Atlas

### Erro: "Invalid JWT"

Solução: Verificar JWT_SECRET está configurado corretamente

## Monitoramento

### Ver Logs

```bash
vercel logs seu-api
```

### Monitorar Performance

Acessar dashboard da Vercel:
- https://vercel.com/dashboard
- Selecionar o projeto
- Ir para "Analytics"

## Atualizar Código

Após fazer mudanças no código:

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

A Vercel fará deploy automático!

## Próximos Passos

- [ ] Configurar domínio customizado
- [ ] Ativar HTTPS
- [ ] Configurar CI/CD
- [ ] Adicionar testes automatizados
- [ ] Implementar rate limiting
- [ ] Adicionar monitoring e alertas

## Suporte

- Documentação Vercel: https://vercel.com/docs
- Documentação Express: https://expressjs.com
- Comunidade: https://vercel.com/community
