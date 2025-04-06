# Step 1: Use the official Python image
FROM python:3.10-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy requirements.txt
COPY requirements.txt /app/

# Step 4: Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy the rest of the backend code
COPY . /app/

# Step 6: Expose the port provided by Render
EXPOSE $PORT

# Step 7: Start the application using Gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:$PORT", "--log-file", "-"]
