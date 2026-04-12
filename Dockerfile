FROM python:3.12-slim

# Install system dependencies including GDAL for Django GIS
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    postgresql-client \
    binutils \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

# Set GDAL environment variables
ENV GDAL_CONFIG=/usr/bin/gdal-config
ENV GDAL_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Collect static files
RUN cd backend && python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Run migrations and start app
CMD cd backend && \
    python manage.py migrate && \
    daphne -b 0.0.0.0 -p 8000 core.asgi:application
