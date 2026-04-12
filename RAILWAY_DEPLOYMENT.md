# 🚀 Railway Deployment Guide

## Variáveis de Ambiente Necessárias

Configure estas variáveis no painel do Railway:

```env
# ============================================================================
# DJANGO & SECURITY
# ============================================================================
SECRET_KEY=Myg09-9hsDulS2dOJ4dfPEb8hfVM5Bh_JAFJ4QgipFXJi8fH7aO5pDgnG-h1YvZXZD4
DEBUG=False
ALLOWED_HOSTS=vibemap-production-1897.up.railway.app

# ============================================================================
# DATABASE (PostgreSQL + PostGIS - Railway fornece automaticamente)
# ============================================================================
DATABASE_URL=postgresql://user:password@host:port/dbname
# Ou configure individuamente:
DB_ENGINE=django.contrib.gis.db.backends.postgis
DB_NAME=seu_db
DB_USER=seu_user
DB_PASSWORD=sua_senha
DB_HOST=seu_host
DB_PORT=5432

# ============================================================================
# REDIS (Railway fornece automaticamente se adicionar Redis plugin)
# ============================================================================
REDIS_URL=redis://seu-redis-host:6379/0

# ============================================================================
# JWT AUTHENTICATION
# ============================================================================
JWT_SECRET_KEY=seu-jwt-secret-key-aqui
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=30

# ============================================================================
# EXTERNAL APIS
# ============================================================================
MAPBOX_ACCESS_TOKEN=seu_mapbox_token_aqui

# ============================================================================
# SECURITY
# ============================================================================
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
CSRF_TRUSTED_ORIGINS=https://vibemap-production-1897.up.railway.app
```

## Como Configurar no Railway

### 1. Gerar uma SECRET_KEY Segura

```bash
# No seu terminal local, execute:
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Copie a saída e use como SECRET_KEY no Railway.

### 2. Adicionar Plugins no Railway

- **PostgreSQL + PostGIS**: Clique em "Add Service" → "Database" → "PostgreSQL"
- **Redis**: Clique em "Add Service" → "Database" → "Redis"

Railway fornecerá automaticamente as URLs em `DATABASE_URL` e `REDIS_URL`.

### 3. Configurar Variáveis

1. Vá para "Variables" no painel do seu projeto
2. Adicione todas as variáveis acima
3. Railway fornecerá automaticamente:
   - `DATABASE_URL`
   - `REDIS_URL`

### 4. Deploy

```bash
# Push para main (ou a branch configurada no Railway)
git push origin main

# Railway automaticamente:
# 1. Lê Procfile
# 2. Roda: cd backend && python manage.py migrate
# 3. Inicia: cd backend && daphne -b 0.0.0.0 -p $PORT core.asgi:application
```

## Verificar Deploy

```bash
# Ver logs no painel Railway ou:
railway logs

# Testar API:
curl https://seu-app.up.railway.app/api/users/
```

## Troubleshooting

### Erro: "ImproperlyConfigured: Set the SECRET_KEY environment variable"
→ Configure `SECRET_KEY` nas variáveis do Railway

### Erro: "could not connect to server"
→ Verifique se Redis e PostgreSQL estão rodando em Railway

### Erro: "permission denied" em logs
→ Railway pode precisar de permissões. Entre em contato com support.

