"""
Script para popular banco com eventos mock
Execute: python manage.py shell < create_mock_events.py
"""
from datetime import datetime, timedelta
from django.contrib.gis.geos import Point
from events.models import Event, EventType
from users.models import User

# Limpar eventos antigos
Event.objects.all().delete()

# Dados dos eventos
events_data = [
    {
        "title": "Show da Banda XYZ",
        "description": "Venha se divertir com a gente!",
        "location": Point(-47.895, -15.770),
        "location_name": "Bar do Centro",
        "starts_at": datetime(2026, 5, 5, 20, 0, 0),
        "ends_at": datetime(2026, 5, 5, 23, 0, 0),
        "max_participants": 100,
        "event_type": 1,
    },
    {
        "title": "Happy Hour Clássico",
        "description": "Cerveja gelada e música ao vivo",
        "location": Point(-47.880, -15.765),
        "location_name": "Pub da Asa Norte",
        "starts_at": datetime(2026, 5, 5, 18, 30, 0),
        "ends_at": datetime(2026, 5, 5, 21, 30, 0),
        "max_participants": 80,
        "event_type": 2,
    },
    {
        "title": "Noite de Forró",
        "description": "Dança e diversão garantida",
        "location": Point(-47.905, -15.790),
        "location_name": "Festa no Deck",
        "starts_at": datetime(2026, 5, 5, 22, 0, 0),
        "ends_at": datetime(2026, 5, 6, 2, 0, 0),
        "max_participants": 150,
        "event_type": 3,
    },
    {
        "title": "Live Music Night",
        "description": "Ambiente animado e seguro",
        "location": Point(-47.870, -15.775),
        "location_name": "Casa de Shows",
        "starts_at": datetime(2026, 5, 5, 21, 0, 0),
        "ends_at": datetime(2026, 5, 6, 0, 0, 0),
        "max_participants": 120,
        "event_type": 1,
    },
    {
        "title": "Samba com Galera",
        "description": "Promoção de drinks",
        "location": Point(-47.915, -15.810),
        "location_name": "Roda de Samba",
        "starts_at": datetime(2026, 5, 5, 23, 0, 0),
        "ends_at": datetime(2026, 5, 6, 3, 0, 0),
        "max_participants": 200,
        "event_type": 3,
    },
    {
        "title": "Noite Eletrônica",
        "description": "DJ ao vivo até o amanhecer",
        "location": Point(-47.885, -15.820),
        "location_name": "Boate Club",
        "starts_at": datetime(2026, 5, 6, 0, 0, 0),
        "ends_at": datetime(2026, 5, 6, 5, 0, 0),
        "max_participants": 300,
        "event_type": 4,
    },
    {
        "title": "Karaokê",
        "description": "Cante e divirta-se!",
        "location": Point(-47.875, -15.745),
        "location_name": "Karaokê Downtown",
        "starts_at": datetime(2026, 5, 5, 20, 30, 0),
        "ends_at": datetime(2026, 5, 5, 23, 30, 0),
        "max_participants": 60,
        "event_type": 5,
    },
    {
        "title": "Comedy Show",
        "description": "Muito bom para rir",
        "location": Point(-47.920, -15.795),
        "location_name": "Teatro da Asa",
        "starts_at": datetime(2026, 5, 5, 19, 0, 0),
        "ends_at": datetime(2026, 5, 5, 21, 0, 0),
        "max_participants": 200,
        "event_type": 2,
    },
    {
        "title": "Jazz Night",
        "description": "Música sofisticada",
        "location": Point(-47.882, -15.788),
        "location_name": "Jazz Club",
        "starts_at": datetime(2026, 5, 5, 21, 30, 0),
        "ends_at": datetime(2026, 5, 6, 0, 30, 0),
        "max_participants": 90,
        "event_type": 1,
    },
    {
        "title": "Beer Pong Tournament",
        "description": "Competição de cerveja",
        "location": Point(-47.895, -15.760),
        "location_name": "Sports Bar",
        "starts_at": datetime(2026, 5, 5, 20, 0, 0),
        "ends_at": datetime(2026, 5, 5, 23, 0, 0),
        "max_participants": 50,
        "event_type": 2,
    },
    {
        "title": "Drinks & Beats",
        "description": "Open bar até meia-noite",
        "location": Point(-47.910, -15.805),
        "location_name": "Sky Lounge",
        "starts_at": datetime(2026, 5, 5, 22, 30, 0),
        "ends_at": datetime(2026, 5, 6, 1, 30, 0),
        "max_participants": 180,
        "event_type": 4,
    },
]

# Obter primeiro usuário (ou criar se não existir)
try:
    user = User.objects.first()
    if not user:
        print("❌ Nenhum usuário encontrado. Crie um usuário primeiro!")
        exit(1)
except:
    print("❌ Erro ao buscar usuário")
    exit(1)

# Criar eventos
created = 0
for data in events_data:
    try:
        event_type_id = data.pop("event_type")
        event = Event.objects.create(
            creator=user,
            event_type_id=event_type_id,
            **data
        )
        created += 1
        print(f"✅ Evento criado: {event.title}")
    except Exception as e:
        print(f"❌ Erro ao criar evento: {str(e)}")

print(f"\n✨ Total de eventos criados: {created}")
