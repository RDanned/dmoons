# Use a lightweight Python base image
FROM python:3.10-slim

# Create a directory for the backend code
WORKDIR /app

# Copy in your requirements list
# If your dependencies are in pyproject.toml, adapt accordingly
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend files into the container
COPY . /app

# Expose FastAPI's default port
EXPOSE 8000

# Launch Uvicorn server on container start
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
