.PHONY: help setup install migrate run-django run-celery run-mobile clean format lint test docker-up docker-down docker-restart docker-logs docker-status

# Variables
VENV_DIR := .venv
PYTHON := $(VENV_DIR)/bin/python
PIP := $(VENV_DIR)/bin/pip
MANAGE := $(PYTHON) backend/manage.py

help:
	@echo "🚀 VibeMap Development Commands"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup              Create virtual environment and install all dependencies"
	@echo "  make install            Install/update Python dependencies"
	@echo "  make install-mobile     Install mobile (npm) dependencies"
	@echo ""
	@echo "Docker Infrastructure:"
	@echo "  make docker-up          Start Docker containers (PostgreSQL, Redis, Adminer)"
	@echo "  make docker-down        Stop all Docker containers"
	@echo "  make docker-restart     Restart Docker containers"
	@echo "  make docker-logs        Show Docker logs"
	@echo "  make docker-status      Show Docker containers status"
	@echo ""
	@echo "Database:"
	@echo "  make migrate            Run Django migrations"
	@echo "  make createsuperuser    Create Django superuser"
	@echo ""
	@echo "Development Servers:"
	@echo "  make run-django         Start Django development server (port 8000)"
	@echo "  make run-celery         Start Celery worker"
	@echo "  make run-beat           Start Celery Beat scheduler"
	@echo "  make run-mobile         Start Expo development server"
	@echo ""
	@echo "Code Quality:"
	@echo "  make format             Format code with black and isort"
	@echo "  make lint               Lint code with flake8"
	@echo "  make test               Run all tests with pytest"
	@echo "  make test-coverage      Run tests with coverage report"
	@echo ""
	@echo "Utilities:"
	@echo "  make shell              Open Django shell"
	@echo "  make static             Collect static files"
	@echo "  make clean              Clean cache and build files"
	@echo "  make logs               Show recent logs"
	@echo ""

setup: create-venv install migrate docker-up
	@echo "✅ Setup complete! Run 'make run-django' to start"

create-venv:
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "📦 Creating Python virtual environment..."; \
		python3 -m venv $(VENV_DIR); \
	else \
		echo "✓ Virtual environment already exists"; \
	fi

install: create-venv
	@echo "📥 Upgrading pip..."
	$(PIP) install --upgrade pip setuptools wheel
	@echo "📦 Installing Python dependencies..."
	$(PIP) install -r requirements.txt

install-mobile:
	@if [ -d "mobile" ]; then \
		echo "📱 Installing mobile dependencies..."; \
		cd mobile && npm install; \
	fi

migrate:
	@echo "🗄️  Running migrations..."
	$(MANAGE) migrate

createsuperuser:
	@echo "👤 Creating superuser..."
	$(MANAGE) createsuperuser

docker-up:
	@echo "🐳 Starting Docker containers..."
	docker compose up -d
	@echo "✅ Containers started:"
	@echo "   - PostgreSQL (port 5432)"
	@echo "   - Redis (port 6379)"
	@echo "   - Adminer (http://localhost:8080)"
	@sleep 2
	docker compose ps

docker-down:
	@echo "🛑 Stopping Docker containers..."
	docker compose down
	@echo "✅ Containers stopped"

docker-restart:
	@echo "🔄 Restarting Docker containers..."
	docker compose restart
	@echo "✅ Containers restarted"
	@sleep 2
	docker compose ps

docker-logs:
	@echo "📋 Docker logs (last 50 lines)..."
	docker compose logs --tail=50 -f

docker-status:
	@echo "📊 Docker containers status:"
	docker compose ps

run-django:
	@echo "🚀 Starting Django development server on http://localhost:8000"
	$(MANAGE) runserver 0.0.0.0:8000

run-celery:
	@echo "⚙️  Starting Celery worker..."
	$(VENV_DIR)/bin/celery -A core worker -l info

run-beat:
	@echo "⏰ Starting Celery Beat scheduler..."
	$(VENV_DIR)/bin/celery -A core beat -l info

run-mobile:
	@if [ -d "mobile" ]; then \
		echo "📱 Starting Expo development server..."; \
		cd mobile && npm start; \
	else \
		echo "❌ Mobile directory not found"; \
	fi

shell:
	@echo "🐚 Opening Django shell..."
	$(MANAGE) shell

static:
	@echo "📦 Collecting static files..."
	$(MANAGE) collectstatic --noinput

format:
	@echo "🎨 Formatting code..."
	$(VENV_DIR)/bin/black backend/
	$(VENV_DIR)/bin/isort backend/

lint:
	@echo "🔍 Linting code..."
	$(VENV_DIR)/bin/flake8 backend/ --max-line-length=120 --exclude=migrations,__pycache__

test:
	@echo "🧪 Running tests..."
	$(PIP) install pytest pytest-django pytest-cov 2>/dev/null || true
	$(VENV_DIR)/bin/pytest backend/ -v

test-coverage:
	@echo "📊 Running tests with coverage..."
	$(PIP) install pytest pytest-django pytest-cov 2>/dev/null || true
	$(VENV_DIR)/bin/pytest backend/ --cov=backend --cov-report=html --cov-report=term
	@echo "📊 Coverage report generated in htmlcov/index.html"

clean:
	@echo "🧹 Cleaning cache and build files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf backend/.coverage htmlcov/ build/ dist/ backend/db.sqlite3
	@echo "✅ Cleanup complete"

logs:
	@echo "📋 Recent logs..."
	@tail -f backend/logs/*.log 2>/dev/null || echo "No logs found"

reactivate:
	@echo "🔄 Reactivating virtual environment..."
	@echo "Run: source .venv/bin/activate"

freeze:
	@echo "📦 Updating requirements.txt..."
	$(PIP) freeze > requirements.txt

info:
	@echo "📊 Project Information:"
	@echo "Python version: $$($(PYTHON) --version 2>&1)"
	@echo "Django version: $$($(MANAGE) --version 2>&1)"
	@echo "Virtual environment: $(VENV_DIR)"
	@echo "Python executable: $$(which $(PYTHON))"
