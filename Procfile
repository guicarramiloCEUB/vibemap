release: cd backend && python manage.py migrate
web: cd backend && daphne -b 0.0.0.0 -p $PORT core.asgi:application
