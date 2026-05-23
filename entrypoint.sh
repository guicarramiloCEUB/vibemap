#!/bin/bash
set -e

echo "🚀 Iniciando VibeMap Backend..."

cd backend

# Step 1: Run migrations
echo "📦 Executando migrations..."
python manage.py migrate
echo "✅ Migrations completadas"

# Step 2: Load event types fixtures
echo "📝 Carregando tipos de eventos (fixtures)..."
python manage.py loaddata events/fixtures/event_types.json
echo "✅ Event types carregados"

# Step 3: Create mock events
echo "🎉 Criando eventos mock..."
python manage.py shell < create_mock_events.py
echo "✅ Eventos mock criados"

# Step 4: Collect static files (se necessário)
echo "📁 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput --clear || true
echo "✅ Arquivos estáticos coletados"

# Step 5: Start Daphne server
echo "🎧 Iniciando Daphne server em 0.0.0.0:8000..."
exec daphne -b 0.0.0.0 -p 8000 core.asgi:application
