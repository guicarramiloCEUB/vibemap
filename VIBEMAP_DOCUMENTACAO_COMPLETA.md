# VibeMap MVP — Documentação Completa
**Versão:** 1.0 — Draft | **Data:** Março 2026 

---

## Índice
1. [Product Requirements Document (PRD)](#prd)
2. [Documentação Técnica da Stack](#stack)
3. [Status de Dependências](#dependencias)

---

# PRD — Product Requirements Document {#prd}

## Executive Summary
- **Produto:** VibeMap
- **Versão:** MVP (1.0)
- **Status:** Draft
- **Data:** Março 2026

### Visão do Produto
VibeMap é um mapa social de eventos em tempo real que combina eventos de parceiros comerciais (bares, casas de festa, shows) com eventos orgânicos relatados pelos próprios usuários — funcionando como o Waze para a vida noturna e cultural urbana. O usuário abre o app e vê instantaneamente o que está acontecendo ao seu redor agora.

---

## Problema

### Definição
Não existe uma forma confiável e em tempo real de descobrir o que está acontecendo ao redor de você agora. Apps de agenda cultural mostram eventos programados, mas não refletem a realidade do momento — o bar que está vazio numa sexta, o show que esgotou, a festa espontânea que surgiu.

### Por Que as Soluções Atuais Falham

| Solução Atual | Limitação |
|---|---|
| Sympla / Eventbrite | Eventos programados, sem tempo real, sem UGC, sem mapa social |
| Fever | Curadoria premium, ignora eventos espontâneos e bares independentes |
| Swarm / Foursquare | Check-in passivo, sem broadcast ativo, culturalmente morto no Brasil |
| Grupos de WhatsApp | Não escalável, sem geolocalização, ruído alto |
| Instagram Stories | Descoberta dependente de quem você já segue, sem mapa |

### Oportunidade
O espaço de mapa social com UGC de eventos não tem player dominante no Brasil. A lacuna está exatamente na combinação de tempo real + geolocalização + validação social por outros usuários.

---

## Público-Alvo

### Persona Primária: O Agitador Urbano
**Perfil:**
- 18–35 anos, mora ou frequenta capitais brasileiras
- Sai de 2 a 4 vezes por semana, decide o roteiro na hora ou com pouca antecedência
- Usa o celular como interface principal para tomar decisões de lazer
- Consome Instagram, TikTok e grupos de WhatsApp para descobrir o que rola

**Jobs to Be Done:**
- **Funcional:** descobrir onde está tendo movimento agora, sem precisar perguntar para ninguém
- **Emocional:** sentir que não está perdendo nada, estar por dentro do que acontece na cidade
- **Social:** compartilhar experiências com o grupo e ser a pessoa que sabe onde ir

**Frustrações atuais:**
- Chegar num bar vazio que parecia cheio no Instagram
- Não saber que tinha um show rolando a 500m de distância
- Depender de indicações de amigos que nem sempre estão disponíveis

### Persona Secundária: O Parceiro Comercial
**Perfil:**
- Dono ou gestor de bar, casa de show, produtor de eventos
- Quer divulgar eventos com pouco esforço e custo baixo
- Precisa de visibilidade para público que está próximo e decidindo agora

**Jobs to Be Done:**
- **Funcional:** cadastrar eventos rapidamente e aparecer para quem está por perto
- **Emocional:** sentir que tem controle sobre a divulgação sem depender de agência ou anúncio pago
- **Social:** construir uma base de seguidores dentro do app

---

## User Stories

### Epic Principal: Descoberta de Eventos em Tempo Real

#### História Primária (H1)
> "Como um usuário que quer sair hoje à noite, quero ver no mapa o que está acontecendo ao meu redor agora, filtrando por distância, para decidir onde ir sem precisar pesquisar em vários lugares."

**Critérios de Aceitação:**
- O mapa carrega eventos num raio configurável pelo usuário (ex: 1km, 5km, 10km)
- Eventos são exibidos como pins diferenciados por tipo (orgânico vs. parceiro)
- O mapa atualiza em tempo real quando novos eventos são criados na área visível
- Ao tocar em um pin, abre um pop-up com os detalhes do evento

#### H2 — Relato de Evento Orgânico
> "Como usuário que chegou num bar, quero reportar isso no mapa em menos de 30 segundos para que outras pessoas saibam."

**Critérios de aceitação:**
- Fluxo de criação com no máximo 4 campos: tipo de evento, descrição curta, localização (automática ou manual) e duração estimada
- O evento aparece no mapa imediatamente após criação para outros usuários na área
- Usuários novos precisam de 2 confirmações de terceiros para o evento aparecer publicamente (anti-spam)

#### H3 — Confirmação de Eventos
> "Como usuário que passou pelo local de um evento reportado, quero confirmar ou desmentir para ajudar outros usuários e manter o mapa confiável."

**Critérios de aceitação:**
- Botão de confirmar/desmentir acessível diretamente do pop-up do evento
- Cada confirmação estende a vida útil do evento no mapa (decay function)
- Cada negação penaliza o score do evento
- O usuário recebe feedback visual imediato da sua ação

#### H4 — Detalhes do Evento
> "Como usuário que viu um pin no mapa, quero ver os detalhes do evento antes de decidir ir."

**Critérios de aceitação:**
- Pop-up exibe: nome/descrição, tipo, horário de criação, distância, número de confirmações, e nome do criador (parceiro ou usuário)
- Eventos de parceiros exibem informações adicionais: endereço completo, horário de funcionamento, foto de capa
- Ação de "Vou!" disponível no pop-up (salva intenção, não exige confirmação de presença real)

#### H5 — Cadastro de Evento pelo Parceiro
> "Como gestor de um bar parceiro, quero cadastrar um evento para essa noite pelo painel web em menos de 5 minutos."

**Critérios de aceitação:**
- Formulário com: título, descrição, tipo, data/hora início e fim, endereço (com geocodificação automática) e foto de capa opcional
- Evento aparece imediatamente no mapa após publicação
- Parceiro consegue editar ou encerrar o evento após publicação
- Dashboard básico mostra: visualizações, confirmações e "vou!" do evento

---

## Funcionalidades do MVP

### Must Have — P0

#### 1. Mapa com eventos por raio
O mapa é a tela principal do app. Usuário define o raio de busca (padrão: 5km) e vê todos os eventos ativos nesse raio. Pins diferenciados visualmente por tipo de evento e origem (orgânico vs. parceiro). Atualização em tempo real via WebSocket.

- **Esforço estimado:** 2 semanas
- **Risco principal:** configuração do Mapbox com eject do Expo, e estabilidade da conexão WebSocket em produção

#### 2. Relato de evento orgânico
Fluxo simplificado de criação de evento com localização automática via GPS. Inclui seleção de tipo (show ao vivo, fila, promoção, agito geral, etc.), descrição livre curta e duração estimada. Evento entra no sistema de decay imediatamente após criação.

- **Esforço estimado:** 2 semanas
- **Risco principal:** calibração do threshold de confirmações para novos usuários vs. spam

#### 3. Sistema de confirmações e decay
Cada evento orgânico tem um score de vida que decai com o tempo. Confirmações de outros usuários recarregam o score; negações penalizam. Evento some do mapa quando o score cai abaixo do threshold. Peso de confirmação varia por reputação do usuário (usuários novos têm peso menor).

- **Esforço estimado:** 1,5 semana
- **Risco principal:** definir parâmetros corretos de meia-vida sem dados reais — devem ser configuráveis via admin Django

#### 4. Pop-up de detalhes do evento
Componente de bottom sheet que abre ao tocar num pin. Exibe informações do evento e ações disponíveis (confirmar, desmentir, "vou!"). Visual diferente para eventos de parceiros vs. orgânicos.

- **Esforço estimado:** 1 semana
- **Risco principal:** baixo

#### 5. Plataforma web para parceiros
Painel React com Refine.dev conectado à API Django. Funcionalidades: cadastro e gestão de eventos, upload de foto de capa, dashboard com métricas básicas. Autenticação separada do app mobile, com role de "parceiro".

- **Esforço estimado:** 2 semanas
- **Risco principal:** geocodificação automática de endereço no formulário de cadastro

### Should Have — P1 (se o tempo permitir no MVP)
- Sistema de follows entre usuários e feed de eventos de quem você segue
- Filtros por tipo de evento no mapa (só shows, só bares, etc.)
- Histórico de eventos que o usuário criou ou confirmou

### Won't Have neste release — P2

| Funcionalidade | Motivo | Planejado para |
|---|---|---|
| Chat temporário por evento | Alta complexidade técnica, não essencial para validação | v1.1 |
| Venda de ingressos | Requer estrutura legal e integração de pagamento | v1.1 |
| Sistema de pontos/reputação visível | Pós-validação de engajamento | v2 |
| Stories de eventos | Complexidade de storage com TTL | v2 |
| Versão desktop do app | Fora de escopo | Indefinido |

---

## Requisitos Não-Funcionais

### Performance
- Carregamento inicial do mapa: menos de 3 segundos em 4G
- Latência de atualização em tempo real (evento criado → aparecer no mapa de outro usuário): menos de 2 segundos
- API response time: menos de 200ms no p95

### Segurança e Privacidade
- Autenticação via JWT com refresh token
- Localização do usuário nunca armazenada historicamente sem consentimento explícito
- Conformidade básica com LGPD: política de privacidade clara, opção de deletar conta e dados
- Rate limiting por usuário para criação de eventos (máximo 3 eventos orgânicos por hora)

### Escalabilidade
- MVP deve suportar até 1.000 usuários simultâneos sem mudança de arquitetura
- Sistema de células geográficas (geohash) para segmentar broadcasts de WebSocket por área

### Plataforma e Compatibilidade
- iOS 14+ e Android 10+
- React Native com Expo (bare workflow após eject para Mapbox)
- Sem suporte offline no MVP — app requer conexão ativa

---

## Estratégia Anti-Mapa Vazio
Este é o maior risco de produto identificado. Um mapa vazio nos primeiros dias mata o engajamento antes de começar.

**Estratégias para mitigar:**

1. **Antes do lançamento:** Fechar pelo menos 5 parceiros comerciais na área de lançamento para garantir eventos fixos no mapa desde o dia 1.

2. **Lançamento geográfico concentrado:** Lançar em um bairro específico para concentrar os primeiros usuários e aumentar a densidade de eventos orgânicos numa área pequena.

3. **Incentivo ao primeiro relato:** Onboarding que pede explicitamente ao usuário para reportar o que está vendo agora como primeira ação no app.

4. **Notificações de área:** Push notification quando um novo evento orgânico aparece no raio padrão do usuário.

5. **Seed manual:** Durante o beta, a equipe cria eventos orgânicos manualmente para simular atividade enquanto a base de usuários cresce.

---

## Métricas de Sucesso

### North Star Metric
**Eventos confirmados por dia** — reflete tanto a criação de conteúdo quanto o engajamento de validação, os dois comportamentos centrais do produto.

### OKRs do MVP (Primeiros 90 dias)
**Objetivo:** Validar o loop de criação e confirmação de eventos com usuários reais

- **KR1:** 500 usuários cadastrados no beta fechado
- **KR2:** 40% dos usuários criam pelo menos 1 evento orgânico (ativação)
- **KR3:** Retenção D1 acima de 30%
- **KR4:** Média de 3 confirmações por evento orgânico ativo

### Tabela de Métricas

| Categoria | Métrica | Target | Como Medir |
|---|---|---|---|
| Aquisição | Usuários cadastrados | 500 | Django Admin |
| Ativação | % que criou ≥1 evento | 40% | Query no banco |
| Retenção | Retenção D1 | 30% | Sessões por user_id |
| Engajamento | Confirmações/evento | 3 média | Query no banco |
| Conteúdo | Eventos orgânicos/dia | 20+ | Dashboard interno |
| Parceiros | Parceiros ativos | 5+ | Django Admin |

---

## Restrições e Premissas

### Restrições
- **Budget de infraestrutura:** até USD 50/mês (estimativa atual: USD 5–20/mês)
- **Prazo:** 4 meses para MVP funcional
- **Time:** solo developer
- **Monetização:** zero no MVP

### Premissas
- Usuários beta serão recrutados manualmente via rede do fundador, não via aquisição paga
- Parceiros iniciais serão abordados diretamente, sem self-service no MVP
- O app será lançado primeiro em uma única cidade ou bairro, não nacionalmente
- A validação de identidade de parceiros será manual no MVP

---

## Questões em Aberto
- [ ] Nome definitivo do app (placeholder atual: VibeMap)
- [ ] Cidade e bairro exatos de lançamento
- [ ] Identidade visual e design system
- [ ] Lista definitiva de tipos de evento orgânico disponíveis no MVP

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Mapa vazio / baixo engajamento inicial | Alta | Alto | Parceiros pré-fechados + lançamento concentrado geograficamente |
| Django Channels instável em produção | Média | Alto | Testar configuração ASGI + Redis no mês 1 |
| Eject do Expo quebrando o build | Média | Médio | Reservar 1 semana só para isso no início |
| Abuso com eventos falsos | Média | Médio | Rate limiting + threshold de confirmações para usuários novos |
| Parceiros não aderirem | Média | Alto | Validar interesse de pelo menos 3 parceiros antes de construir o painel |

---

## Definition of Done para o MVP

### Desenvolvimento
- Todas as features P0 implementadas e funcionando em produção
- Todos os critérios de aceitação das user stories verificados manualmente
- Rate limiting e anti-spam básicos ativos

### Qualidade
- Fluxo completo testado em iOS e Android físicos
- Nenhum crash crítico no fluxo principal em 30 minutos de uso contínuo
- Latência de tempo real validada com múltiplos usuários simultâneos

### Lançamento
- Analytics básico configurado
- Política de privacidade publicada
- Beta fechado com grupo inicial de 20–30 usuários antes da abertura para 500

---

# Documentação Técnica da Stack {#stack}

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         VIBEMAP ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📱 MOBILE APP (React Native + Expo)                             │
│  ├─ Mapbox Maps (@rnmapbox/maps)                                │
│  ├─ websocket client (geohash-based)                            │
│  ├─ Zustand (state management)                                  │
│  └─ React Navigation (v7.x)                                     │
│                                                                   │
│         ↓ (REST + WebSocket)                                     │
│                                                                   │
│  🖥️  BACKEND (Django 6.0.3)                                      │
│  ├─ Django REST Framework                                        │
│  ├─ GeoDjango + PostGIS (spatial queries)                       │
│  ├─ Django Channels (WebSocket)                                 │
│  ├─ Celery (async tasks)                                        │
│  └─ PostgreSQL 16+ (database)                                   │
│                                                                   │
│         ↓ (REST API)                                             │
│                                                                   │
│  🌐 WEB PANEL (React + Refine.dev) — PARTNER ADMIN              │
│                                                                   │
│         ↓ (S3 API)                                               │
│                                                                   │
│  ☁️  EXTERNAL SERVICES                                           │
│  ├─ Mapbox (maps + geocoding)                                   │
│  ├─ Firebase FCM (push notifications)                           │
│  ├─ Cloudflare R2 (image storage)                               │
│  └─ Cloudflare (CDN)                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Backend

### 1.1 Django + Django REST Framework

**Versão Instalada:** Django 6.0.3  
**Recomendado:** Django 5.x–6.x, DRF 3.15+  
**Status:** ✅ Instalado

Django é o núcleo do backend, responsável por toda a lógica de negócio, autenticação, modelagem de dados e exposição da API REST. A escolha se justifica pela maturidade do ecossistema, pela integração nativa com GeoDjango para dados geoespaciais.

**Responsabilidades:**
- Autenticação e autorização (JWT via djangorestframework-simplejwt)
- CRUD de eventos (orgânicos e de parceiros)
- Sistema de confirmações e cálculo de score
- Rate limiting de criação de eventos
- Endpoints de métricas para o painel de parceiros

**Bibliotecas Django necessárias:**

| Biblioteca | Versão | Status | Finalidade |
|---|---|---|---|
| Django | 6.0.3 | ✅ Instalado | Framework core |
| djangorestframework | 3.15+ | ⏳ INSTALAR | API REST |
| djangorestframework-simplejwt | 5.x | ⏳ INSTALAR | Autenticação JWT |
| django-cors-headers | 4.9.0 | ✅ Instalado | CORS para web panel |
| django-ratelimit | 4.x | ⏳ INSTALAR | Rate limiting |
| django-environ | 0.21+ | ⏳ INSTALAR | Gestão de env vars |
| daphne | 4.x | ⏳ INSTALAR | Servidor ASGI |

### 1.2 GeoDjango + PostGIS

**Status:** ⏳ Pendente  
**Versões:** PostgreSQL 16+, PostGIS 3.4+

GeoDjango é o módulo de Django que habilita operações geográficas no banco de dados. Em conjunto com a extensão PostGIS do PostgreSQL.

**Funcionalidades principais:**

- **PointField:** armazenar localização de cada evento como coordenada geográfica nativa
- **ST_DWithin:** buscar eventos dentro de raio em metros a partir da posição do usuário
- **Geohash:** segmentar canais WebSocket por células geográficas

**Exemplo de query espacial:**
```python
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D

user_location = Point(longitude, latitude, srid=4326)
radius_meters = radius_km * 1000
events = Event.objects.filter(
    location__dwithin=(user_location, D(m=radius_meters)),
    score__gte=0.1,
    is_active=True
).annotate(
    distance=Distance('location', user_location)
).order_by('distance')
```

**Setup do banco:**
```sql
CREATE EXTENSION postgis;
CREATE INDEX events_location_gist ON events_event USING GIST (location);
```

### 1.3 Django Channels + Redis (WebSocket)

**Status:** ⏳ Pendente  
**Versões recomendadas:** channels 4.x, channels-redis 4.x

Django Channels estende o Django para suportar protocolos assíncronos, principalmente WebSocket.

**Arquitetura de canais por geohash:**
- Cada usuário conectado se inscreve em um canal identificado pelo **geohash de precisão 5** da sua posição
- Cada célula tem aproximadamente 4,9km x 4,9km
- Quando evento é criado, backend publica no canal do geohash correspondente via Redis

**Tipos de mensagens WebSocket:**

| Tipo | Direção | Payload |
|---|---|---|
| event.created | Server → Client | id, título, tipo, coordenadas, score |
| event.updated | Server → Client | id, novo score, confirmações |
| event.expired | Server → Client | id (para remover o pin) |
| subscribe | Client → Server | geohash da posição atual |

**Redis como Channel Layer:**
Redis é o broker que permite comunicação entre workers Django. Sem ele, usuários em instâncias diferentes não receberiam mensagens.

### 1.4 Celery + Celery Beat

**Status:** ⏳ Pendente  
**Versão recomendada:** Celery 5.x

Celery executa tarefas assíncronas e periódicas sem bloquear o ciclo de request/response.

**Tarefas assíncronas:**
- Publicar novo evento no canal WebSocket correto após criação
- Enviar push notification via Firebase FCM quando evento é criado na área
- Recalcular score de um evento após confirmação ou negação

**Tarefas periódicas (Celery Beat):**
- **A cada 15 minutos:** recalcular score de todos os eventos ativos e marcar como expirados os que caíram abaixo do threshold
- **A cada 15 minutos:** publicar sinais de expiração no WebSocket
- **A cada 1 hora:** limpeza de eventos expirados há mais de 24 horas

**Fórmula de decay:**
```
score(t) = score_inicial × (0.5 ^ (t / half_life))
         + confirmations_boost
         - denials_penalty
```
Onde `t` é o tempo em minutos e `half_life` é configurável por tipo de evento. Padrão:
- Fila em bar: 30 min
- Show ao vivo: 60 min
- Agito geral: 45 min

### 1.5 PostgreSQL + PostGIS

**Status:** ⏳ Pendente (banco local setup necessário)  
**Versões recomendadas:** PostgreSQL 16+, PostGIS 3.4+

**Modelo de dados principal:**

```
User
  ├─ id (PK)
  ├─ email
  ├─ password_hash
  ├─ user_type (user | partner)
  ├─ reputation_score (float, default 0.5)
  └─ push_token (device token para FCM)

EventType
  ├─ id (PK)
  ├─ name (ex: "show ao vivo", "fila")
  ├─ half_life_minutes (configurável)
  ├─ icon (para UI)
  └─ color (para diferenciação visual)

Event
  ├─ id (PK)
  ├─ title
  ├─ description
  ├─ event_type (FK → EventType)
  ├─ location (PointField — PostGIS)
  ├─ creator (FK → User)
  ├─ score (float, recalculado pelo Celery)
  ├─ is_active (bool)
  ├─ created_at (datetime)
  ├─ expires_at (datetime)
  └─ origin (organic | partner)

EventConfirmation
  ├─ id (PK)
  ├─ event (FK)
  ├─ user (FK)
  ├─ confirmation_type (confirm | deny)
  └─ weight (baseado na reputação do usuário)

EventAttendance
  ├─ id (PK)
  ├─ event (FK)
  ├─ user (FK)
  └─ created_at

PartnerEvent (extensão de Event)
  ├─ address
  ├─ full_address
  ├─ cover_image_url (Cloudflare R2)
  ├─ start_time
  ├─ end_time
  └─ views_count
```

---

## 2. Aplicativo Mobile

### 2.1 React Native + Expo (Bare Workflow)

**Versões Atuais:**
- React: 19.1.0 ✅
- React Native: 0.81.5 ✅
- Expo: ~54.0.0 ✅

**Status:** ✅ Parcialmente instalado (faltam libs específicas)

React Native permite desenvolver para iOS e Android com uma única base de código. O projeto utiliza **Expo Bare Workflow**, o que significa acesso aos arquivos nativos quando necessário.

**O eject para bare workflow é obrigatório** por causa do Mapbox SDK, que requer configuração nativa.

**Principais bibliotecas mobile:**

| Biblioteca | Versão Atual | Versão Recomendada | Status | Finalidade |
|---|---|---|---|---|
| react | 19.1.0 | 18+ | ✅ Instalado | React core |
| react-native | 0.81.5 | 0.73+ | ✅ Instalado | RN core |
| expo | ~54.0.0 | SDK 51+ | ✅ Instalado | Toolchain |
| @rnmapbox/maps | — | latest | ⏳ INSTALAR | Mapbox renderização |
| expo-location | — | latest | ⏳ INSTALAR | GPS access |
| expo-secure-store | — | latest | ⏳ INSTALAR | JWT storage seguro |
| expo-notifications | — | latest | ⏳ INSTALAR | Push notifications |
| @gorhom/bottom-sheet | — | 4.x | ⏳ INSTALAR | Bottom sheet UI |
| axios | 1.13.6 | 1.13+ | ✅ Instalado | HTTP requests |
| zustand | — | 4.x | ⏳ INSTALAR | State management |
| @react-navigation/native | 7.2.0 | 7.x | ✅ Instalado | Navigation |
| @react-navigation/stack | 7.8.7 | 7.x | ✅ Instalado | Stack navigation |
| ngeohash | — | 0.13+ | ⏳ INSTALAR | Geohash calculation |

### 2.2 Mapbox SDK para React Native

**Status:** ⏳ Pendente  
**Biblioteca:** @rnmapbox/maps (latest)

Mapbox é escolhido sobre Google Maps pelos seguintes motivos:
- Nível gratuito generoso (50.000 map loads por mês)
- Melhor suporte a customização visual de pins
- SDK React Native oficial e ativo
- Custo previsível

**Funcionalidades Mapbox utilizadas:**

- **MapView:** componente principal que renderiza o mapa base
- **ShapeSource + SymbolLayer:** renderizam pins como camada GeoJSON (mais performance que React components)
- **Camera:** controla posição e zoom, animado para localização do usuário
- **Mapbox Geocoding API:** conversão endereço → coordenadas no painel de parceiros

### 2.3 WebSocket Client no App

**Status:** ⏳ Pendente (será implementado com Channels)

Arquitetura de reconexão automática com backoff exponencial: 1s → 2s → 4s → 8s → até 30s.

**Fluxo de conexão:**
1. App obtém posição GPS atual
2. Calcula geohash de precisão 5
3. Conecta ao WebSocket: `wss://api.vibemap.com/ws/events/{geohash}/`
4. Backend inscreve cliente no channel group
5. Recebe `event.created` → adiciona pin ao mapa
6. Recebe `event.expired` → remove pin

---

## 3. Painel Web para Parceiros

### 3.1 React + Refine.dev

**Status:** ⏳ Pendente  
**Versões recomendadas:** React 18+, Refine 4.x, Ant Design 5.x

Refine é um meta-framework React especializado em admin panels. Gera interfaces CRUD completas a partir da definição dos resources.

**Configuração principal:**
```javascript
const App = () => (
  <Refine
    dataProvider={dataProvider("https://api.vibemap.com/api")}
    authProvider={authProvider}
    resources={[
      {
        name: "partner/events",
        list: EventList,
        create: EventCreate,
        edit: EventEdit,
        show: EventMetrics,
      },
    ]}
  />
);
```

**Benefícios:**
- Listagem paginada automática
- Formulários de criação/edição configuráveis
- Autenticação JWT integrada
- Gerenciamento de estado de dados

---

## 4. Serviços Externos

### 4.1 Mapbox
**Plano:** Free tier (50.000 map loads/mês)  
**Status:** ⏳ API key necessária

Utilizado para:
- Renderização do mapa no app mobile
- API de geocodificação no painel web

### 4.2 Firebase Cloud Messaging (FCM)
**Plano:** Gratuito  
**Status:** ⏳ Credenciais necessárias

Push notifications para iOS e Android via `expo-notifications` + `firebase-admin` (Python).

### 4.3 Cloudflare R2
**Plano:** Free tier (10GB storage, 1M requisições/mês)  
**Status:** ⏳ Credenciais necessárias

Object storage para fotos de eventos de parceiros. API compatível com S3.

### 4.4 Cloudflare (DNS + CDN)
**Plano:** Free tier  
**Status:** ⏳ Domínio necessário

DNS + CDN para assets estáticos do painel web.

---

## 5. Infraestrutura de Hosting

### 5.1 Railway
**Custo estimado:** USD 5–20/mês  
**Status:** ⏳ Pendente

Serviços a provisionar:

| Serviço | RAM | vCPU | Storage | Custo est. |
|---|---|---|---|---|
| Django (ASGI/Daphne) | 512MB | 1 | — | USD 5/mês |
| Celery Worker | 256MB | — | — | USD 3/mês |
| Celery Beat | 128MB | — | — | USD 2/mês |
| PostgreSQL + PostGIS | — | — | 1GB | USD 5/mês |
| Redis | — | — | 256MB | USD 3/mês |
| **TOTAL** | — | — | — | **~USD 18/mês** |

### 5.2 Expo EAS (Expo Application Services)
**Plano:** Free tier para projetos individuais  
**Status:** ✅ Disponível

Serviço de build e distribuição do app mobile. Gera .ipa (iOS) e .apk/.aab (Android).

---

## 6. Ferramentas de Desenvolvimento

### 6.1 Controle de Versão e CI/CD
- **GitHub:** repositório com branches main (prod), develop (dev), feature/*
- **Railway:** deploy automático quando push em main

### 6.2 Gestão de Projeto
- **Azure DevOps Boards:** Épico → Feature → Backlog Item → Task

### 6.3 Variáveis de Ambiente

Arquivo `.env.example` (versionado) com todas as variáveis necessárias:

```env
# Django
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=

# Database
DATABASE_URL=

# Redis
REDIS_URL=

# JWT
JWT_SECRET_KEY=
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=30

# Mapbox
MAPBOX_ACCESS_TOKEN=

# Firebase
FIREBASE_CREDENTIALS_JSON=

# Cloudflare R2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT_URL=
```

---

# Status de Dependências {#dependencias}

## Instalado Atualmente ✅

```
Django==6.0.3
asgiref==3.11.1
django-cors-headers==4.9.0
psycopg2-binary==2.9.11
sqlparse==0.5.5

React 19.1.0
React Native 0.81.5
Expo ~54.0.0
@react-navigation/native 7.2.0
@react-navigation/stack 7.8.7
axios 1.13.6
react-native-gesture-handler ~2.28.0
react-native-reanimated ~4.1.1
react-native-safe-area-context ~5.6.0
react-native-screens ~4.16.0
react-native-vector-icons 10.3.0
```

## Próximas Instalações Necessárias ⏳

### Backend (Django)
```bash
# REST API + Auth
pip install djangorestframework==3.15.0
pip install djangorestframework-simplejwt==5.3.2

# Real-time + Async
pip install channels==4.1.0
pip install channels-redis==4.1.0
pip install celery==5.4.0

# Utilities
pip install django-ratelimit==4.1.0
pip install django-environ==0.21.0
pip install daphne==4.1.0
```

### Mobile (React Native)
```bash
npm install @rnmapbox/maps
npm install expo-location
npm install expo-secure-store
npm install expo-notifications
npm install zustand@latest
npm install ngeohash
npm install @gorhom/bottom-sheet
```

### Web Panel (React)
```bash
npm install refine-core@latest
npm install @refinedev/react-router-v6
npm install @refinedev/simple-rest
npm install antd@latest
npm install axios
```

---

## Próximos Passos

1. **Instalar dependências faltantes** conforme status acima
2. **Configurar PostgreSQL local com PostGIS**
3. **Configurar Django Channels + Redis**
4. **Implementar models de Event, User, EventConfirmation**
5. **Criar primeiro endpoint REST da API**
6. **Configurar autenticação JWT**
7. **Começar integração com Mapbox no app mobile**

---

**Versão:** 1.0 — Draft  
**Última atualização:** Março 2026  
**Owner:** Parada
