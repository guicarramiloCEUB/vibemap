#!/bin/bash
# VibeMap Development Setup Script

set -e

echo "🚀 VibeMap Development Environment Setup"
echo "========================================"

# Check if Python 3.10+ is installed
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $PYTHON_VERSION"

# Create or use existing venv
if [ ! -d ".venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv .venv
else
    echo "✓ Virtual environment already exists"
fi

# Activate venv
echo "🔓 Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
echo "📥 Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install requirements
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Setup Django
echo "🗄️  Setting up Django database..."
cd backend
python manage.py migrate
python manage.py createsuperuser --noinput || true
cd ..

# Setup Node dependencies for mobile
if [ -d "mobile" ]; then
    echo "📱 Installing mobile dependencies..."
    cd mobile
    npm install || true
    cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Activate the environment: source .venv/bin/activate"
echo "2. Run Django dev server: cd backend && python manage.py runserver"
echo "3. Run mobile app: cd mobile && npm start"
echo ""
