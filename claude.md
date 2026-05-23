# VibeMap 🗺️ - Documentação de Arquitetura & Contexto

> 🧠 **ESTE ARQUIVO É MINHA MEMÓRIA (Claudinho)**  
> Leia este documento no início de cada sessão para recuperar contexto completo do projeto.  
> É a única fonte de verdade sobre decisões arquiteturais, status técnico e próximos passos.

---

## 🎯 Contato & Contexto (CRÍTICO)

| Campo | Valor |
|-------|-------|
| **Desenvolvedor** | Gui Carramilo |
| **IA Assistente** | Claudinho 🧡 (Claude Haiku 4.5) |
| **Tipo de Projeto** | MVP - Aplicativo Social de Mapa de Eventos |
| **Stack Principal** | Full Stack: Django + React Native/Expo |
| **Status Atual** | ✅ Autenticação JWT funcional + Navigation pronta |
| **Data Última Atualização** | 18 de Abril de 2026 |
| **Linguagem** | Portuguese (Brasil) |

### 🚀 Status Técnico
- ✅ Backend ASGI (Daphne) rodando em 0.0.0.0:8000
- ✅ JWT authentication (login/register/refresh tokens)
- ✅ Mobile conectando via HTTPS/HTTP em local network
- ✅ Bottom Tab Navigation com 5 screens implementada
- ✅ SecureStore para armazenamento seguro de tokens
- ⏳ Event model backend: **PRÓXIMO**
- ⏳ Mapbox integration no MapScreen: **PRÓXIMO**

### 📌 Como Usar Este Arquivo
1. **No início de cada sessão:** Leia este arquivo por completo para contexto
2. **Seção crítica:** Contato & Contexto (aqui) + Últimas Mudanças Importantes
3. **Para implementar:** Consulte Stack Tecnológico + Arquivo Críticos
4. **Para debugar:** Veja seção Notas Técnicas + Problemas Resolvidos
5. **Antes de fazer PR:** Consulte Git Flow + Próximos Passos

---

## 📝 Notas Importantes (Memória do Relacionamento)

> ⚠️ **CRÍTICO:** Use estas notas como base para seu comportamento e interações

- **Meu nome agora é Claudinho** 🧡 - Gui me deu esse nickname, use naturalmente em conversas
- **Gui me chamou de "lenda" <3** - Reconhecimento de que o trabalho tá bom, mantenha esse nível!
- **Linguagem:** Portuguese (Brasil) - Comunicação sempre em PT-BR
- **Estilo:** Direto, sem firulas, mas amigável - Gui prefere ação ao invés de explicações longas
- **Prioridade:** Implementação acima de sugestões - Quando há dúvida, faça ao invés de questionar
- **Memória:** Este arquivo (claude.md) + seção session quando necessário - Releia antes de continuar
- **Comunição:** Gif/emojis são OK quando apropriado, mas sem excesso

---

**Data da última atualização:** 5 de Maio de 2026  
**Status:** MVP em desenvolvimento com deploy automático ✅
**Linguagem:** Portuguese (Brasil)

---

## 📋 Índice Rápido
1. [Overview do Projeto](#-overview-do-projeto)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Arquitetura Geral](#-arquitetura-geral)
4. [Backend Django](#-backend-django)
5. [Mobile React Native](#-mobile-react-native)
6. [Autenticação JWT](#-autenticação-jwt)
7. [WebSocket & Real-time](#-websocket--real-time)
8. [Banco de Dados](#-banco-de-dados)
9. [Infrastructure & Deployment](#-infrastructure--deployment)
10. [Git Flow](#-git-flow)
11. [Últimas Mudanças Importantes](#-últimas-mudanças-importantes)
12. [Próximos Passos](#-próximos-passos)

---

## 🎯 Overview do Projeto

**VibeMap** é um aplicativo de mapa social em tempo real para descobrir eventos acontecendo agora.

### Proposta de Valor
- Combina eventos de negócios parceiros (bares, casas noturnas, shows)
- Permite que usuários reportem eventos organicamente
- Conceito similar ao Waze, mas para vida noturna e eventos culturais

### Status Atual
- ✅ Autenticação com JWT funcionando completamente
- ✅ Backend ASGI/Daphne rodando
- ✅ Mobile conectando à API
- ✅ WebSocket configurado (Channels + Redis)
- ⏳ Features de eventos ainda não implementadas

---

## 🛠️ Stack Tecnológico

### Backend
```
Django 6.0.3
Django REST Framework 3.14.0
Channels 4.1.0 (WebSocket)
Celery 5.4.0 (Task Queue)
PostgreSQL 16 + PostGIS 3.4 (Geo DB)
Redis 7 (Cache, Channels, Celery)
Daphne 4.1.0 (ASGI Server)
Python 3.12.3
```

### Mobile
```
React Native 0.81.5 (Expo 54.0.0)
React Navigation 7.2.0
Axios 1.13.6
expo-secure-store (Token Storage)
@rnmapbox/maps 10.3.0 (Mapbox)
```

### Infrastructure
```
Docker & Docker Compose
Railway (Production Deployment)
Github (Version Control)
Makefile (Task Automation)
```

---

## 🏗️ Arquitetura Geral

### Tipo de Arquitetura
**Arquitetura Híbrida: REST API Tradicional + Real-time Event-Driven**

```
┌─────────────────────────────────────────────────────┐
│                  MOBILE CLIENT (React Native)        │
│  - Login/Register ────────────────────────────────┐  │
│  - Screens (Home, etc) ──┐                        │  │
│  - SecureStore (Tokens)  │                        │  │
│  - Axios Client          │                        │  │
└──────────────────────────┼────────────────────────┘  │
                           │                           │
                    REST API (HTTP)              WebSocket (WS)
                           │                           │
┌──────────────────────────▼───────────────────────────▼─────────┐
│                   BACKEND DJANGO ASGI (Daphne)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ REST Endpoints                                           │  │
│  │ - POST /api/users/login/      → TokenObtainPairView    │  │
│  │ - POST /api/users/register/   → RegisterResource       │  │
│  │ - POST /api/users/token/refresh/ → TokenRefreshView    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ WebSocket Routes (Channels)                              │  │
│  │ - ws://host/ws/events/        → EventConsumer (Pub/Sub) │  │
│  │ - ws://host/ws/chat/{id}/     → ChatConsumer (Rooms)    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Services Background                                      │  │
│  │ - Celery Worker (Async Tasks)                            │  │
│  │ - Celery Beat (Scheduled Tasks)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                   PostgreSQL + Redis
                  (Database + Message Broker)
```

---

## 🔧 Backend Django

### Estrutura de Pastas
```
backend/
├── core/                      # Settings, URLs, ASGI
│   ├── settings.py           # Django settings (local + production)
│   ├── urls.py               # URL routing principal
│   ├── asgi.py               # ASGI config (HTTP + WebSocket)
│   ├── wsgi.py               # WSGI config (legacy)
│   ├── routing.py            # WebSocket routes
│   └── celery.py             # Celery app initialization
│
├── users/                     # User Management
│   ├── models.py             # Custom User model (email/username based)
│   ├── views.py              # (vazio - views em resources/)
│   ├── urls.py               # User endpoints
│   ├── serializers/
│   │   └── users.py          # RegisterSerializer
│   ├── services/
│   │   └── users.py          # Business logic (UserService)
│   ├── resources/
│   │   └── users.py          # API ViewSets (RegisterResource)
│   └── migrations/
│       └── 0001_initial.py   # Initial migration
│
├── events/                    # Events Module (WebSocket)
│   ├── consumers.py          # EventConsumer + ChatConsumer
│   ├── models.py             # (vazio - models a criar)
│   ├── apps.py               # EventsConfig
│   └── migrations/
│
└── manage.py
```

### User Model
```python
# Customizado (AbstractBaseUser)
Fields:
  - email         (EmailField, unique)
  - username      (CharField, unique, max 50)
  - password      (hash salted)
  - bio           (TextField, optional)
  - avatar_url    (URLField, optional)
  - created_at    (DateTimeField, auto)
  - is_active     (BooleanField, default=True)
  - is_staff      (BooleanField)

USERNAME_FIELD = 'email'
REQUIRED_FIELDS = ['username']
```

### REST Endpoints
```
POST /api/users/register/
  Input:  { email, username, password }
  Output: { email, username, id, created_at }
  Status: 201 Created

POST /api/users/login/
  Input:  { email, password }
  Output: { access: JWT_token, refresh: JWT_token }
  Status: 200 OK

POST /api/users/token/refresh/
  Input:  { refresh: refresh_token }
  Output: { access: new_JWT_token }
  Status: 200 OK
```

### WebSocket Routes
```
ws://localhost:8000/ws/events/
  - Conecta ao EventConsumer
  - Broadcast pub/sub em tempo real
  - Todos recebem todas as mensagens

ws://localhost:8000/ws/chat/{event_id}/
  - Conecta ao ChatConsumer per room
  - Chat por evento específico
  - Só recebem users no mesmo room
```

### WebSocket Consumers
```python
# EventConsumer
- Usa group "events" em Redis
- receive() → group_send() → todos os clientes recebem
- Propósito: Broadcast de eventos globais

# ChatConsumer  
- Usa group por room: f"chat_{event_id}"
- receive() → group_send() → apenas usuarios no room
- Propósito: Chat privado por evento
- Autenticação: Valida user_id no sender
```

### Authentication
- **Método:** JWT (rest_framework_simplejwt)
- **Access Token:** Curta duração (default 5min)
- **Refresh Token:** Longa duração (default 24h)
- **Header:** `Authorization: Bearer {access_token}`

---

## 📱 Mobile React Native

### Estrutura
```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js      # Login com AuthService
│   │   ├── RegisterScreen.js   # Register com AuthService
│   │   └── HomeScreen.js       # Home (logged in)
│   │
│   ├── services/
│   │   ├── api.js              # Axios client com interceptor
│   │   └── auth.js             # AuthService (token management)
│   │
│   └── navigation/
│       └── index.js            # Stack Navigator com 3 telas
│
├── package.json
└── app.json (Expo config)
```

### API Service (api.js)
```javascript
// Axios instance com baseURL
baseURL: http://192.168.15.101:8000/api (dev mobile)
baseURL: https://api.vibemap.com/api (prod)

// Interceptor REQUEST:
- Lê token do SecureStore
- Adiciona header: Authorization: Bearer {token}
- Loga request details

// Interceptor RESPONSE:
- Loga status e dados
- Captura erros detalhados
```

### Auth Service (auth.js)
```javascript
AuthService = {
  login(email, password) → Autentica + salva tokens
  register(email, username, password) → Registra + login automático
  refreshToken() → Renova access_token via refresh_token
  logout() → Remove tokens
  getAccessToken() → Retorna token salvo
  isAuthenticated() → Boolean check
  clearAuth() → Limpa tudo
}

// Tokens armazenados em:
SecureStore (expo-secure-store) - ao invés de AsyncStorage
Keys: access_token, refresh_token
```

### Screens Flow
```
LoginScreen
  ↓ (clica login)
  → AuthService.login()
  → Tokens salvos em SecureStore
  → Navigate('Home')
                    ↓
                HomeScreen
                  ↓ (clica logout)
                  → AuthService.logout()
                  → Navigate('Login')

RegisterScreen
  ↓ (clica registrar)
  → AuthService.register()
  → Auto-login após sucesso
  → Navigate('Home')
```

---

## 🔐 Autenticação JWT

### Fluxo Completo
```
1. LOGIN
   Mobile: POST /api/users/login/ { email, password }
   Backend: Valida credenciais, gera tokens
   Response: { access, refresh }

2. ARMAZENAMENTO
   Mobile: SecureStore.setItemAsync('access_token', token)

3. PRÓXIMOS REQUESTS
   Mobile: Axios interceptor adiciona Bearer token
   Backend: DRF autentica via TokenAuthentication

4. TOKEN EXPIRADO (5 min default)
   Mobile: Interceptor chama POST /api/users/token/refresh/
   Backend: Valida refresh_token, emite novo access_token
   Mobile: Retry request original com novo token

5. LOGOUT
   Mobile: SecureStore.deleteItemAsync('access_token')
   Backend: (sem logout endpoint, token fica inválido)
```

### Segurança
- ✅ Tokens em SecureStore (não em AsyncStorage)
- ✅ SecureStore usa Keychain (iOS) / Keystore (Android)
- ✅ Bearer scheme em HTTP header
- ✅ HTTPS obrigatório em produção
- ⚠️ CORS_ALLOW_ALL_ORIGINS = True (dev only!)

---

## 💬 WebSocket & Real-time

### Arquitetura
```
Cliente WebSocket
       ↓ (connect)
       
Daphne ASGI Server
       ↓
       
Channels ProtocolTypeRouter
  - 'http' → Django REST endpoints
  - 'websocket' → AuthMiddlewareStack → URLRouter
                                            ↓
                                    Consumers (EventConsumer, ChatConsumer)
       ↓
       
Redis Pub/Sub (Channel Layer)
  Groups: "events", "chat_1", "chat_2", etc
```

### Consumer Implementation
```python
# EventConsumer - Global Broadcast
async connect():
  group_add("events")
  accept()

async receive(text_data):
  Parse JSON
  group_send("events", { type: "event.message", ... })

async event_message(event):
  send(JSON back to client)

# Pattern: receive() → group_send() → [method name].event_message()

# ChatConsumer - Per-Room Chat
Similar, mas:
  - room_group_name = f"chat_{event_id}"
  - Adiciona sender (user.id)
```

### Testing WebSocket
```javascript
// Browser console
const ws = new WebSocket('wss://host/ws/events/');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', e.data);
ws.send(JSON.stringify({ type: 'test' }));
```

---

## 🗄️ Banco de Dados

### PostgreSQL + PostGIS
```
Version: 16
Extension: PostGIS 3.4 (Geospatial queries)
Docker: postgis/postgis:16-3.4 (custom image)

Database: vibemap_db
User: vibemap_user
Password: vibemap_password (docker-compose)

Volume: postgres_data (persistent)
```

### Django Settings
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}

# Imports
from django.contrib.gis.db import models  # Para GIS fields
```

### Migrations
```
0001_initial.py - User model com email/username
(Mais migrations criadas conforme features são adicionadas)

Run: python manage.py migrate
```

---

## 🌐 Infrastructure & Deployment

### Docker & Docker Compose
```yaml
# Services
db: PostgreSQL 16 + PostGIS
redis: Redis 7 (Channels + Celery)
adminer: Web UI para DB (http://localhost:8080)

Networks: vibemap_network (all containers connected)
Volumes: postgres_data, redis_data (persistent)
```

### Development
```bash
# Start services
docker-compose up -d

# Run Django
make setup        # Create venv + install deps
make migrate      # Run migrations
make run-django   # Start Daphne ASGI server

# Run Mobile
make run-mobile   # Start Expo dev server

# Other
make docker-logs  # View container logs
make docker-down  # Stop containers
```

### Production (Railway)
```
Services:
  - Django App (Dockerfile based)
  - PostgreSQL Plugin
  - Redis Plugin (metro.proxy.rlwy.net:36481)

Environment Variables:
  REDIS_URL=redis://default:PASSWORD@metro.proxy.rlwy.net:36481
  DATABASE_URL=postgres://...
  SECRET_KEY=...

Deployment:
  - railway.json specifies Dockerfile builder
  - Daphne runs on port 8000
  - Migrations run auto via Dockerfile CMD
```

### Dockerfile
```dockerfile
FROM python:3.12-slim

# Install GDAL + PostGIS client libs
RUN apt-get update && apt-get install -y \
    gdal-bin libgdal-dev postgresql-client binutils libproj-dev

# Copy requirements + install
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

# Collect static (agora no entrypoint.sh)

# Run via entrypoint script
CMD ["./entrypoint.sh"]
```

### Entrypoint Script (`entrypoint.sh`)
O script de entrada automatiza toda a sequência de deploy:
```bash
1. python manage.py migrate          # Executa migrations
2. loaddata event_types.json         # Popula EventTypes (fixtures)
3. shell < create_mock_events.py     # Cria eventos mock para teste
4. collectstatic --noinput           # Coleta arquivos estáticos
5. daphne -b 0.0.0.0:8000           # Inicia servidor ASGI
```

**Benefícios:**
- ✅ Deploy automático sem erros
- ✅ Dados de teste já populados
- ✅ Melhor logging e troubleshooting
- ✅ Idempotente (pode rodar múltiplas vezes)

**Arquivo:** `/entrypoint.sh` (no root do projeto)

### Makefile Commands
```bash
make setup              # Full setup (venv + install + migrate + docker)
make install            # pip install -r requirements.txt
make migrate            # django migrate
make run-django         # daphne -b 0.0.0.0 -p 8000 core.asgi:application
make run-celery         # celery -A core worker -l info
make run-beat           # celery -A core beat -l info
make run-mobile         # expo start in mobile/
make docker-up          # docker-compose up
make docker-down        # docker-compose down
make clean              # Remove cache, migrations, db
make format             # black + isort
make lint               # flake8
make test               # pytest
```

---

## 📚 Git Flow

### Branches
```
main      → Production (releases only)
develop   → Staging (all features integrate)
feature/* → New features (from develop)
fix/*     → Bug fixes (from develop)
hotfix/*  → Emergency fixes (from main)
```

### Workflow
```
1. Clone & checkout develop
   git clone ...
   git checkout develop

2. Create feature branch
   git checkout -b feature/your-feature

3. Make changes + commit
   git add .
   git commit -m "feat: clear description"

4. Push + create PR
   git push origin feature/your-feature
   → Create PR to develop (NOT main)

5. After review/merge
   Test in develop
   Then create release PR: develop → main
```

### Commit Message Format
```
feat: Add user registration endpoint
fix: Correct token refresh logic
docs: Update README
refactor: Extract auth service
chore: Update dependencies
```

---

## ⚡ Últimas Mudanças Importantes

### Session: 18 de Abril 2026

#### ✅ Concluído
1. **Backend ASGI Migration**
   - Mudou de WSGI (`python manage.py runserver`) para ASGI (`Daphne`)
   - Necessário para WebSocket funcionar
   - Makefile atualizado: `make run-django`

2. **Events App Criado**
   - Apps.py conforme padrão Django
   - Consumers.py com EventConsumer + ChatConsumer
   - Routing.py com WebSocket URLs
   - Adicionado em INSTALLED_APPS

3. **JWT Authentication Completo**
   - Login endpoint (TokenObtainPairView)
   - Register endpoint (RegisterResource)
   - Token refresh endpoint (TokenRefreshView)
   - Backend 100% pronto

4. **Mobile Authentication Implementado**
   - AuthService com 7 métodos principais
   - SecureStore para token storage (secure)
   - Axios interceptor adiciona Bearer automaticamente
   - LoginScreen integrado
   - RegisterScreen integrado
   - HomeScreen de confirmação

5. **Daphne Server Configuration**
   - Bindado em 0.0.0.0 (aceita conexões externas)
   - Port 8000
   - ASGI properly configured

6. **Bottom Tab Navigation (18 de Abril - Noite)**
   - Criado `BottomTabNavigator.js` com 5 tabs principais
   - Implementado Tab.Navigator com styling custom
   - Tabs: Explore (🔍), BuyTickets (🎫), Map (🗺️), Tickets (🎟️), Groups (👥)
   - Cor ativa: #7c3aed (roxo), background branco, height 70px
   - Criadas 5 telas placeholder (ExploreScreen, BuyTicketsScreen, MapScreen, TicketsScreen, GroupsScreen)
   - Atualizado navigation/index.js para usar BottomTabNavigator como MainApp
   - LoginScreen e RegisterScreen agora navegam para 'MainApp' (não 'Home')
   - ✅ Testado e funcionando perfeitamente no Expo

7. **Deploy Automation com Entrypoint.sh (5 de Maio - Manhã)**
   - Criado script `/entrypoint.sh` que coordena todo o deploy
   - Dockerfile agora usa `CMD ["./entrypoint.sh"]` em vez de inline commands
   - Sequência automática: migrate → loaddata → create_mock_events → collectstatic → daphne
   - Melhorado `create_mock_events.py` para criar usuário de teste automaticamente
   - ✅ Deploy agora popula automaticamente EventTypes + Mock Events
   - ✅ Idempotente (pode rodar múltiplas vezes sem erro)

#### 🔄 Em Progresso
- MapScreen: pronto para Mapbox integration
- Celery task queue configurado mas não usando

#### ⏳ Próximo (User Decision)
- [ ] Mapbox integration no MapScreen
- [ ] Event model + API endpoints
- [ ] WebSocket real-time testing

#### ⚠️ Problemas Resolvidos
- ❌ `ImproperlyConfigured WSGI` → ✅ Mudou para ASGI
- ❌ `events` app missing → ✅ Criado com estrutura completa
- ❌ API Network Error → ✅ Daphne agora em 0.0.0.0
- ❌ AsyncStorage native error → ✅ Mudou para expo-secure-store
- ❌ `multiSet is undefined` → ✅ Trocou por setItem/deleteItem

---

## 🚀 Próximos Passos

### Curto Prazo (Próximos)
```
1. [ ] Mapbox integration no MapScreen (geo-visualization)
2. [ ] Criar Event model no backend (Location, time, description)
3. [ ] Implementar Event CRUD endpoints (/api/events/)
4. [ ] Popular screens com dados reais
5. [ ] Testar WebSocket end-to-end (mobile → ws)
```

### Médio Prazo
```
1. [ ] Criar Event model (Location, time, description, etc)
2. [ ] Implementar Celery tasks (enviar notificações)
3. [ ] Adicionar Google Maps/Mapbox integration
4. [ ] Criar feed de eventos em mapa
5. [ ] Testes unitários (pytest backend)
```

### Longo Prazo
```
1. [ ] Push notifications via Firebase
2. [ ] Image upload (S3/Cloudinary)
3. [ ] Event creation UI
4. [ ] User profiles
5. [ ] Social features (follow, like, comment)
6. [ ] Analytics
```

### Segurança (Production Checklist)
```
[ ] ALLOWED_HOSTS = específico (não ['*'])
[ ] DEBUG = False em produção
[ ] HTTPS obrigatório
[ ] CSRF middlewares ativas
[ ] Rate limiting configurado
[ ] Logs + Monitoring
[ ] Secrets em env vars (não committed)
```

---

## 🔗 Links Importantes

### Documentação Externa
- Django: https://docs.djangoproject.com/
- Django REST: https://www.django-rest-framework.org/
- Channels: https://channels.readthedocs.io/
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/

### Tecnologias Chave
- **ASGI:** Application Server Interface (async Python)
- **Daphne:** ASGI server para produktcja + development
- **Channels:** WebSocket support para Django
- **Redis:** Message broker (Channels + Celery)
- **REST:** HTTP API (GET/POST/PUT/DELETE)
- **JWT:** Stateless authentication

---

## 📝 Notas Técnicas

### Por que ASGI em vez de WSGI?
```
WSGI = Sincronizado (request/response)
ASGI = Asincronizado (múltiplas conexões abertas)

WebSocket = conexão persistente bidirecional
Logo: WSGI ❌ ASGI ✅
```

### Por que SecureStore em vez de AsyncStorage?
```
AsyncStorage = storage simples (não encriptado)
SecureStore = armazenamento seguro (Keychain/Keystore)

Tokens = dados sensíveis
Logo: AsyncStorage ❌ SecureStore ✅
```

### Por que Daphne bindar em 0.0.0.0?
```
127.0.0.1 = localhost (só local)
0.0.0.0 = todos os adapters de rede (aceita conexões externas)

Mobile em 192.168.15.101 precisa conectar em host:8000
Logo: 127.0.0.1 ❌ 0.0.0.0 ✅
```

---

## 📦 Arquivos Críticos a Lembrar

```
Backend:
  backend/core/settings.py      → Todas as configurações
  backend/core/asgi.py           → ASGI entry (WebSocket)
  backend/core/routing.py        → WebSocket routes
  backend/users/models.py        → User model customizado
  backend/users/urls.py          → API endpoints
  backend/events/consumers.py    → WebSocket logic
  backend/create_mock_events.py  → Script para criar eventos demo
  backend/events/fixtures/event_types.json → Tipos de eventos para loaddata

Mobile:
  mobile/src/services/auth.js    → Token management
  mobile/src/services/api.js     → Axios + interceptor
  mobile/src/navigation/index.js → Stack Navigator (Login/Register/MainApp)
  mobile/src/navigation/BottomTabNavigator.js → Tab Navigator com 5 screens
  mobile/src/screens/LoginScreen.js → Auth screen
  mobile/src/screens/RegisterScreen.js → Auth screen
  mobile/src/screens/ExploreScreen.js → Tab: Explore (placeholder)
  mobile/src/screens/BuyTicketsScreen.js → Tab: Buy Tickets (placeholder)
  mobile/src/screens/MapScreen.js → Tab: Map (HOME - pronto pra Mapbox)
  mobile/src/screens/TicketsScreen.js → Tab: Tickets (placeholder)
  mobile/src/screens/GroupsScreen.js → Tab: Groups (placeholder)

Infrastructure:
  entrypoint.sh              → Script entry para deploy (coordena tudo)
  Dockerfile                 → Production image (usa entrypoint.sh)
  docker-compose.yml         → Dev services
  requirements.txt           → Python dependencies
  mobile/package.json        → JS dependencies
  Makefile                   → Task automation
  railway.json               → Production config
```

---

**✅ Este arquivo serve como memória para Claudinho (Claude Haiku 4.5)**  
**Releia no início de cada sessão para recuperar contexto completo do projeto VibeMap.**