import psycopg2

# Database connection parameters
db_params = {
    "dbname": "clubhubdb",
    "user": "myuser",
    "password": "mypassword",
    "host": "*",
    "port": 5432
}

try:
    # Connect to PostgreSQL
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()
    
    # Test query
    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    
    print(f"Connected to PostgreSQL: {db_version[0]}")

    # Close connection
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
