# VibeMap 🗺️

A real-time social map for discovering events happening around you now. Combine partner business events (bars, clubs, shows) with organic user-reported events — like Waze for nightlife and cultural events.

**Status:** MVP Development (March 2026)

---

## 🎯 Quick Start

### For Developers

#### Option 1: Using Docker (Recommended for PostgreSQL + Redis)
```bash
# Start PostgreSQL and Redis containers
docker-compose up -d

# Create Python virtual environment and install dependencies
make setup

# Run migrations
make migrate

# Start Django server
make run-django
```

#### Option 2: Manual Setup (see DEVELOPMENT.md for full details)
```bash
make setup
make run-django
```

### For Mobile Development
```bash
cd mobile
npm start
# Press 'i' for iOS simulator or 'a' for Android emulator
```

---

## 📋 Project Structure

```
vibemap/
├── backend/              # Django REST API
│   ├── core/            # Settings, URLs, ASGI
│   ├── users/           # User management
│   ├── events/          # Events (to be created)
│   └── manage.py
├── mobile/              # React Native (Expo)
│   ├── src/
│   │   ├── screens/
│   │   ├── navigation/
│   │   └── services/
│   └── package.json
├── web/                 # React + Refine (to be created)
├── requirements.txt     # Python dependencies
├── Makefile            # Development commands
├── docker-compose.yml  # PostgreSQL + Redis
├── setup.sh            # Setup script
└── DEVELOPMENT.md      # Detailed setup guide
```

---

## ⚙️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **App** | React Native + Expo | 0.81.5 / SDK 54 |
| **Maps** | Mapbox | Latest |
| **Backend** | Django + DRF | 6.0.3 / 3.15+ |
| **Database** | PostgreSQL + PostGIS | 16+ / 3.4+ |
| **Real-time** | Django Channels + Redis | 4.x / 7.x |
| **Tasks** | Celery | 5.x |
| **Hosting** | Railway | ASGI |
| **Push** | Firebase FCM | - |
| **Storage** | Cloudflare R2 | - |

---

## 🚀 Available Commands

### Setup & Installation
```bash
make setup              # One-time setup
make install            # Install/update dependencies
make install-mobile     # Install mobile dependencies
```

### Development Servers
```bash
make run-django         # Django API (http://localhost:8000)
make run-celery         # Celery worker
make run-beat           # Celery Beat scheduler
make run-mobile         # Expo dev server
```

### Database & Admin
```bash
make migrate            # Run migrations
make createsuperuser    # Create Django admin user
make static             # Collect static files
```

### Code Quality
```bash
make format             # Format code (black, isort)
make lint               # Lint code (flake8)
make test               # Run tests (pytest)
make test-coverage      # Tests with coverage report
```

See full list: `make help`

---

## 📦 Docker Setup

### Start Services
```bash
docker-compose up -d
```

Services available:
- **PostgreSQL**: localhost:5432 (credentials in docker-compose.yml)
- **Redis**: localhost:6379
- **Adminer** (DB UI): http://localhost:8080

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f db      # Database logs
docker-compose logs -f redis   # Redis logs
```

---

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and fill with your values:

```bash
cp .env.example .env
nano .env  # Edit with your credentials
```

Key variables:
- `DEBUG` - Django debug mode
- `SECRET_KEY` - Django security key  
- `DB_*` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `MAPBOX_ACCESS_TOKEN` - Mapbox API key
- `FIREBASE_CREDENTIALS_JSON` - Firebase credentials

---

## 📱 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/events` | GET | List events |
| `/api/events` | POST | Create event |
| `/api/events/{id}` | GET | Event details |
| `/api/events/{id}/confirm` | POST | Confirm event |
| `/api/events/{id}/deny` | POST | Deny event |
| `/admin` | - | Django admin panel |

WebSocket: `ws://localhost:8000/ws/events/{geohash}/`

---

## 🧪 Testing

```bash
# Run all tests
make test

# Run with coverage
make test-coverage

# Run specific test
pytest backend/users/tests.py -v
```

---

## 📚 Documentation

- [**DEVELOPMENT.md**](DEVELOPMENT.md) - Detailed setup & troubleshooting guide
- [**VIBEMAP_DOCUMENTACAO_COMPLETA.md**](VIBEMAP_DOCUMENTACAO_COMPLETA.md) - Full PRD + Technical Stack documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

## 🔐 Security

- JWT authentication with refresh tokens
- Rate limiting on event creation
- User location never stored historically without consent
- Environment variables for all sensitive data

---

## 🚢 Deployment

### Backend (Railway)
```bash
# Push to main branch triggers automatic deployment
git push origin main
```

### Mobile (Expo EAS)
```bash
# Build and submit to TestFlight/play Store
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
```

---

## 📞 Support Issues

**Python environment issues?**
- See DEVELOPMENT.md troubleshooting section
- Run: `make clean && make setup`

**PostgreSQL/Redis connection issues?**
- Check Docker: `docker-compose ps`
- Verify .env file has correct credentials

**Port already in use?**
- Kill process: `lsof -i :8000` then `kill -9 <PID>`

---

## 👥 Team

**Guilherme Carramilo**


---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test: `make test`
3. Format code: `make format`
4. Commit: `git commit -m "feat: description"`
5. Push & create PR

---
