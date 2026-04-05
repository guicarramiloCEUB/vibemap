# 🚀 VibeMap Development Setup Guide

## Project Structure

```
vibemap/
├── .venv/                    ← Python virtual environment (ÚNICO)
├── backend/                  ← Django REST API
│   ├── manage.py
│   ├── core/                 ← Settings, URLs, ASGI
│   ├── users/                ← User app
│   └── ...
├── mobile/                   ← React Native (Expo)
│   ├── package.json
│   ├── App.js
│   └── src/
├── web/                      ← React + Refine (quando criado)
│   ├── package.json
│   └── src/
├── requirements.txt          ← Python dependencies (ÚNICA)
├── .env.example              ← Template de variáveis
├── .env                      ← Seu arquivo local (NÃO commitar)
└── setup.sh                  ← Setup script
```

## Prerequisites

- **Python:** 3.10+ ([download](https://www.python.org/downloads/))
- **Node.js:** 16+ ([download](https://nodejs.org/))
- **PostgreSQL:** 16+ ([download](https://www.postgresql.org/download/))
- **Redis:** 7+ ([download](https://redis.io/download))
- **Git:** ([download](https://git-scm.com/download))

## Initial Setup (One Time)

### 1. Clone the repository
```bash
git clone <repo-url>
cd vibemap
```

### 2. Create `.env` from template
```bash
cp .env.example .env
# Edit .env with your local values
nano .env
```

### 3. Setup PostgreSQL with PostGIS

#### On macOS (via Homebrew):
```bash
brew install postgresql@16 postgis

# Start PostgreSQL
brew services start postgresql@16

# Create database and enable PostGIS
psql postgres <<EOF
CREATE DATABASE vibemap_db;
CREATE USER vibemap_user WITH PASSWORD 'your_password_here';
ALTER ROLE vibemap_user SET client_encoding TO 'utf8';
ALTER ROLE vibemap_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE vibemap_user SET default_transaction_deferrable TO on;
ALTER ROLE vibemap_user SET default_transaction_read_committed TO on;
ALTER ROLE vibemap_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vibemap_db TO vibemap_user;
\c vibemap_db
CREATE EXTENSION postgis;
EOF
```

#### On Ubuntu/Debian:
```bash
sudo apt-get install postgresql-16 postgresql-16-postgis

# Start PostgreSQL
sudo systemctl start postgresql

# Create database and enable PostGIS
sudo -u postgres psql <<EOF
CREATE DATABASE vibemap_db;
CREATE USER vibemap_user WITH PASSWORD 'your_password_here';
ALTER ROLE vibemap_user SET client_encoding TO 'utf8';
ALTER ROLE vibemap_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE vibemap_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE vibemap_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vibemap_db TO vibemap_user;
\c vibemap_db
CREATE EXTENSION postgis;
EOF
```

#### On Windows:
- Download and install PostgreSQL 16 with PostGIS extension from [postgresql.org](https://www.postgresql.org/download/windows/)
- Use pgAdmin to create database:
  ```
  Database: vibemap_db
  User: vibemap_user
  Password: your_password_here
  ```
- Enable PostGIS: 
  ```sql
  CREATE EXTENSION postgis;
  ```

### 4. Setup Redis

#### On macOS:
```bash
brew install redis
brew services start redis
```

#### On Ubuntu/Debian:
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

#### On Windows:
Download from [memurai.com](https://www.memurai.com/) or use WSL2 with Ubuntu.

### 5. Run the setup script
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Create Python virtual environment
- ✅ Install all Python dependencies
- ✅ Run Django migrations
- ✅ Install mobile dependencies

## Daily Development Workflow

### Activate Python Environment
```bash
# macOS/Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

### Backend (Django API)
```bash
cd backend

# Run migrations
python manage.py migrate

# Create superuser (if not exists)
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000

# Access Django Admin: http://localhost:8000/admin
# Access API: http://localhost:8000/api
```
CELERY POR ENQUANTO NAO SERA UTILZIADO
### Backend (Celery - in separate terminal)
```bash
source .venv/bin/activate
cd backend

# Start Celery worker
celery -A core worker -l info

# In another terminal, start Celery Beat (for periodic tasks)
celery -A core beat -l info
```

### Mobile App (React Native)
```bash
cd mobile

# Install dependencies (if not already done)
npm install

# Start the development server
npm start

# In the Expo CLI, press:
# i - for iOS simulator
# a - for Android emulator
# w - for web preview
```

### Access Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| Django Admin | http://localhost:8000/admin | Django administration panel |
| Django API | http://localhost:8000/api | REST API endpoints |
| WebSocket | ws://localhost:8000/ws | Real-time events |
| Mobile (Expo) | http://localhost:8081 | Expo development server |

## Common Commands

### Python/Django
```bash
# Create a new app
python manage.py startapp <app_name>

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Shell (access Django models directly)
python manage.py shell

# Collect static files
python manage.py collectstatic

# Run tests
pytest

# Format code
black .
isort .

# Lint
flake8
```

### Node/Mobile
```bash
# Install new package
npm install <package-name>

# Remove package
npm uninstall <package-name>

# Check dependencies
npm list

# Clear cache
npm cache clean --force
```

### Git
```bash
# Check status
git status

# Create new feature branch
git checkout -b feature/your-feature-name

# Push to remote
git push origin feature/your-feature-name

# Create pull request
# (via GitHub/GitLab interface)
```

## Troubleshooting

### Issue: `ModuleNotFoundError: No module named 'django_extensions'`
**Solution:** Reinstall dependencies
```bash
pip install -r requirements.txt
```

### Issue: `could not connect to server: Connection refused`
**Solution:** PostgreSQL is not running
```bash
# macOS
brew services start postgresql@16

# Ubuntu
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service from Services or use pgAdmin
```

### Issue: `Could not connect to Redis at localhost:6379`
**Solution:** Redis is not running
```bash
# macOS
brew services start redis

# Ubuntu
sudo systemctl start redis-server

# Windows
# Run redis-server.exe
```

### Issue: `EACCES: permission denied` (npm install)
**Solution:** Fix npm permissions
```bash
npm install --no-optional
# or
sudo chown -R $(whoami) ~/.npm
```

### Issue: Port already in use
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

## Environment Variables

All variables are defined in `.env`. Key ones:

| Variable | Purpose | Example |
|----------|---------|---------|
| `DEBUG` | Django debug mode | `True` or `False` |
| `SECRET_KEY` | Django security key | Long random string |
| `DB_NAME` | PostgreSQL database name | `vibemap_db` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379/0` |
| `MAPBOX_ACCESS_TOKEN` | Mapbox API key | From mapbox.com dashboard |

## Testing

### Run all tests
```bash
pytest
```

### Run specific test file
```bash
pytest backend/users/tests.py
```

### Run with coverage
```bash
pytest --cov=backend --cov-report=html
```

## Deployment (Quick Overview)

Backend deployment is handled by Railway (see main README for credentials). Mobile is deployed via Expo EAS.

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)
- [Expo Documentation](https://docs.expo.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
