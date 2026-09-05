"""
Script para popular banco com usuários e eventos mock.
Execute: python manage.py shell < create_mock_events.py
"""
from datetime import datetime, timedelta
from django.contrib.gis.geos import Point
from events.models import Event, EventType
from users.models import User

# Criar usuários de teste
created_users = 0
test_password = "123456"

for index in range(1, 36):
    email = f"teste{index}@gmail.com"
    username = f"teste{index}"

    user, created = User.objects.get_or_create(
        email=email,
        defaults={"username": username},
    )

    if created:
        user.set_password(test_password)
        user.save(update_fields=["password"])
        created_users += 1
        print(f"✅ Usuário criado: {email}")
    else:
        print(f"ℹ️ Usuário já existe: {email}")

# Limpar eventos antigos
Event.objects.all().delete()

# Dados dos eventos
events_data = [
    {
        "title": "Show da Banda XYZ",
        "description": "Venha se divertir com a gente!",
        "location": Point(-47.8825, -15.7942),
        "location_name": "Conic",
        "starts_at": datetime(2026, 5, 5, 20, 0, 0),
        "ends_at": datetime(2026, 10, 10, 23, 0, 0),
        "max_participants": 100,
           "status": "APPROVED",
           "event_type": 1,
    },
    {
        "title": "Happy Hour Clássico",
        "description": "Cerveja gelada e música ao vivo",
        "location": Point(-47.8853, -15.7865),
        "location_name": "Asa Norte",
        "starts_at": datetime(2026, 5, 5, 18, 30, 0),
        "ends_at": datetime(2026, 10, 10, 21, 30, 0),
        "max_participants": 80,
           "status": "APPROVED",
           "event_type": 2,
    },
    {
        "title": "Noite de Forró",
        "description": "Dança e diversão garantida",
        "location": Point(-47.8789, -15.7991),
        "location_name": "Asa Sul",
        "starts_at": datetime(2026, 5, 5, 22, 0, 0),
        "ends_at": datetime(2026, 10, 10, 2, 0, 0),
        "max_participants": 150,
           "status": "APPROVED",
           "event_type": 3,
    },
    {
        "title": "Live Music Night",
        "description": "Ambiente animado e seguro",
        "location": Point(-47.8838, -15.7828),
        "location_name": "Eixo Monumental",
        "starts_at": datetime(2026, 5, 5, 21, 0, 0),
        "ends_at": datetime(2026, 10, 10, 0, 0, 0),
        "max_participants": 120,
           "status": "APPROVED",
           "event_type": 1,
    },
    {
        "title": "Samba com Galera",
        "description": "Promoção de drinks",
        "location": Point(-47.8892, -15.7960),
        "location_name": "Setor Comercial Sul",
        "starts_at": datetime(2026, 5, 5, 23, 0, 0),
        "ends_at": datetime(2026, 10, 10, 3, 0, 0),
        "max_participants": 200,
           "status": "APPROVED",
           "event_type": 3,
    },
    {
        "title": "Noite Eletrônica",
        "description": "DJ ao vivo até o amanhecer",
        "location": Point(-47.8758, -15.7902),
        "location_name": "W3 Norte",
        "starts_at": datetime(2026, 5, 6, 0, 0, 0),
        "ends_at": datetime(2026, 10, 10, 5, 0, 0),
        "max_participants": 300,
           "status": "APPROVED",
           "event_type": 4,
    },
    {
        "title": "Karaokê",
        "description": "Cante e divirta-se!",
        "location": Point(-47.8861, -15.8013),
        "location_name": "W3 Sul",
        "starts_at": datetime(2026, 5, 5, 20, 30, 0),
        "ends_at": datetime(2026, 10, 10, 23, 30, 0),
        "max_participants": 60,
           "status": "APPROVED",
           "event_type": 5,
    },
    {
        "title": "Comedy Show",
        "description": "Muito bom para rir",
        "location": Point(-47.8798, -15.7860),
        "location_name": "Conjunto Nacional",
        "starts_at": datetime(2026, 5, 5, 19, 0, 0),
        "ends_at": datetime(2026, 10, 10, 21, 0, 0),
        "max_participants": 200,
           "status": "APPROVED",
           "event_type": 2,
    },
    {
        "title": "Jazz Night",
        "description": "Música sofisticada",
        "location": Point(-47.8910, -15.7927),
        "location_name": "Rodoviária do Plano Piloto",
        "starts_at": datetime(2026, 5, 5, 21, 30, 0),
        "ends_at": datetime(2026, 10, 10, 0, 30, 0),
        "max_participants": 90,
           "status": "APPROVED",
           "event_type": 1,
    },
    {
        "title": "Beer Pong Tournament",
        "description": "Competição de cerveja",
        "location": Point(-47.8849, -15.7984),
        "location_name": "Setor Hoteleiro Sul",
        "starts_at": datetime(2026, 5, 5, 20, 0, 0),
        "ends_at": datetime(2026, 10, 10, 23, 0, 0),
        "max_participants": 50,
           "status": "APPROVED",
           "event_type": 2,
    },
]
# Obter primeiro usuário para associar aos eventos
try:
    user = User.objects.filter(email="teste1@gmail.com").first() or User.objects.first()
    if not user:
        print("❌ Nenhum usuário encontrado para criar eventos")
        exit(1)
except Exception as e:
    print(f"❌ Erro ao buscar/criar usuário: {str(e)}")
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

print(f"\n✨ Total de usuários criados: {created_users}")
print(f"✨ Total de eventos criados: {created}")
