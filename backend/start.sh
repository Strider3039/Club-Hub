#!/bin/bash

echo "Running migrations..."
python manage.py migrate

echo "Starting Gunicorn server..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:${PORT} --log-file -
