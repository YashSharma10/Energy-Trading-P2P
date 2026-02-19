FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for blockchain data
RUN mkdir -p /app/data

# Expose port
EXPOSE 5001

# Set environment variables
ENV FLASK_PORT=5001
ENV FLASK_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:5001/health')"

# Run application
CMD ["python", "app.py"]
