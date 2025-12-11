# Setup Supabase para E-Commerce API

## Passo 1: Criar Projeto Supabase

1. Acessar https://supabase.com
2. Fazer login ou criar conta
3. Clicar em "New Project"
4. Preencher os dados:
   - **Name**: `ecommerce-api`
   - **Database Password**: Gerar senha forte
   - **Region**: Selecionar região mais próxima
5. Clicar em "Create new project"
6. Aguardar criação (pode levar alguns minutos)

## Passo 2: Obter Credenciais

1. Ir para **Settings > API**
2. Copiar:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## Passo 3: Criar Tabelas

### Via SQL Editor

1. Ir para **SQL Editor**
2. Clicar em "New Query"
3. Copiar todo o conteúdo de `supabase/schema.sql`
4. Colar no editor
5. Clicar em "Run"

### Ou via Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Executar migrations
supabase db push
```

## Passo 4: Configurar Autenticação

### Habilitar Email/Password

1. Ir para **Authentication > Providers**
2. Ativar "Email"
3. Configurar:
   - **Confirm email**: Desativado (para desenvolvimento)
   - **Auto confirm user**: Ativado

### Habilitar Google OAuth

1. Ir para **Authentication > Providers > Google**
2. Ativar
3. Preencher:
   - **Client ID**: Seu Google Client ID
   - **Client Secret**: Seu Google Client Secret

### Habilitar GitHub OAuth

1. Ir para **Authentication > Providers > GitHub**
2. Ativar
3. Preencher:
   - **Client ID**: Seu GitHub Client ID
   - **Client Secret**: Seu GitHub Client Secret

## Passo 5: Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto:

```env
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
```

## Passo 6: Instalar Dependências

```bash
npm install
```

## Passo 7: Testar Localmente

```bash
npm run dev
```

Acessar `http://localhost:3001/api/health`

## Passo 8: Inserir Dados de Teste

### Via SQL Editor

```sql
INSERT INTO products (name, price, original_price, category, brand, stock, description, image, rating, review_count)
VALUES
  ('iPhone 15 Pro Max', 9499, 10999, 'smartphones', 'Apple', 45, 'O smartphone mais avançado', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', 4.8, 245),
  ('MacBook Pro 14', 12999, 14999, 'laptops', 'Apple', 23, 'Laptop profissional', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', 4.9, 189),
  ('AirPods Pro', 1899, 2199, 'headphones', 'Apple', 156, 'Fones com cancelamento', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 4.7, 512),
  ('iPad Air', 6499, 7499, 'tablets', 'Apple', 34, 'Tablet versátil', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80', 4.6, 234);
```

## Passo 9: Deploy na Vercel

### 1. Push para GitHub

```bash
git add .
git commit -m "feat: integrar com Supabase"
git push origin main
```

### 2. Configurar Variáveis na Vercel

1. Acessar https://vercel.com/dashboard
2. Selecionar o projeto
3. Ir para **Settings > Environment Variables**
4. Adicionar todas as variáveis do `.env`

### 3. Deploy

```bash
vercel deploy
```

## Troubleshooting

### Erro: "Cannot find module '@supabase/supabase-js'"

Solução:
```bash
npm install @supabase/supabase-js
```

### Erro: "RLS policy violation"

Solução: Verificar RLS policies em **Authentication > Policies**

### Erro: "Table does not exist"

Solução: Executar `supabase/schema.sql` novamente

## Próximos Passos

- [ ] Configurar Storage para imagens
- [ ] Implementar Edge Functions
- [ ] Adicionar webhooks
- [ ] Configurar backups automáticos
- [ ] Implementar rate limiting
- [ ] Adicionar logging e monitoring

## Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
