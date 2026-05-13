#!/bin/bash

set -e

echo "Running migrations..."
python manage.py migrate

echo "Seeding demo data..."
python manage.py seed_data

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
