FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Add the working directory to the Python path
ENV PYTHONPATH /app

# Copy the requirements file from the backend folder
COPY backend/requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project code
COPY . /app/

# Use a shell command for variable interpolation in CMD
CMD bash -c "gunicorn backend.wsgi:application --bind 0.0.0.0:${PORT} --log-file -"
