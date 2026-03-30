# 🎯 VibeMap Installation Status

## ✅ Completed

- ✅ Python virtual environment (`.venv/`)
- ✅ All backend dependencies installed
  - Django 6.0.3
  - DRF 3.14.0
  - Django Channels 4.1.0
  - Celery 5.4.0
  - Firebase Admin, Boto3, etc.
- ✅ All mobile dependencies installed
  - React Native 0.81.5
  - Expo SDK 54
  - React Navigation 7.x
- ✅ Configuration files
  - `.env` file created with local development values
  - `backend/core/settings.py` configured to read from project root

---

## ⚠️ Next Steps: Database & Redis Setup

### Option  1: Using Docker (Recommended)

**Install Docker Compose first:**
```bash
# Ubuntu/Debian
sudo apt install docker.io docker-compose

# macOS (using Homebrew)
brew install --cask docker

# Windows
# Download and install from https://www.docker.com/products/docker-desktop
```

**Then start the services:**
```bash
# From project root
docker-compose up -d

# Verify services are running
docker-compose ps

# Expected output:
# NAME            STATUS
# vibemap_db      Up 
# vibemap_redis   Up
```

**That's it! PostgreSQL + Redis will be ready.** ✅

---

### Option 2: Manual Local Installation

#### On Ubuntu/Debian:
```bash
# Install PostgreSQL 16 and PostGIS
sudo apt update
sudo apt install postgresql-16 postgresql-16-postgis

# Start PostgreSQL
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE vibemap;
CREATE USER postgres WITH PASSWORD 'postgres';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vibemap TO postgres;
\c vibemap
CREATE EXTENSION postgis;
EOF

# Install and start Redis
sudo apt install redis-server
sudo systemctl start redis-server
```

#### On macOS:
```bash
# Install PostgreSQL 16 and PostGIS
brew install postgresql@16 postgis

# Start PostgreSQL
brew services start postgresql@16

# Create database and PostGIS
psql postgres <<EOF
CREATE DATABASE vibemap;
CREATE USER postgres WITH PASSWORD 'postgres';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vibemap TO postgres;
\c vibemap
CREATE EXTENSION postgis;
EOF

# Install and start Redis
brew install redis
brew services start redis
```

#### On Windows:
1. **PostgreSQL:**
   - Download from https://www.postgresql.org/download/windows/
   - Install with PostGIS extension

2. **Redis:**
   - Download from https://www.memurai.com/
   - Download from https://windows.redis.io/ (or run in WSL2)

---

## 🚀 After Database Setup

**Run migrations:**
```bash
cd backend
python manage.py migrate
```

**Create Django superuser (admin):***
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

**Start development server:**
```bash
python manage.py runserver 0.0.0.0:8000
```

**Access the app:**
- Django Admin: http://localhost:8000/admin
- API: http://localhost:8000/api

---

## 📋 Checklist

- [ ] Install Docker or PostgreSQL + Redis manually
- [ ] Start PostgreSQL (either via Docker or systemctl/brew)
- [ ] Start Redis (either via Docker or systemctl/brew)
- [ ] Verify connection: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Start Django server: `python manage.py runserver`

---

## 🔧 Quick Troubleshooting

**"Connection refused" on port 5432?**
→ PostgreSQL is not running. Start it with:
```bash
# Docker
docker-compose up -d db

# macOS
brew services start postgresql@16

# Ubuntu
sudo systemctl start postgresql
```

**"Could not connect to Redis"?**
→ Redis is not running. Start it with:
```bash
# Docker
docker-compose up -d redis

# macOS
brew services start redis

# Ubuntu
sudo systemctl start redis-server
```

---

## 📚 Next: Development Workflow

Once database is running:

```bash
# Terminal 1: Django Server
cd backend
source ../venv/bin/activate
python manage.py runserver

# Terminal 2: Celery (in separate terminal)
source .venv/bin/activate
cd backend
celery -A core worker -l info

# Terminal 3: Mobile (in separate terminal)
cd mobile
npm start
```

Or use Makefile shortcuts:
```bash
make run-django
make run-celery
make run-mobile
```

---

## ✨ Installation Complete Summary

- **Backend Dependencies:** ✅ Installed
- **Mobile Dependencies:** ✅ Installed  
- **Configuration:** ✅ Ready
- **Database:** ⏳ Needs PostgreSQL start
- **Cache:** ⏳ Needs Redis start

**Total time to ready:** ~15 min (with Docker) or ~30 min (manual install)

---

**Last Updated:** March 29, 2026
