# Single-stage Dockerfile for Mind Buddy backend
# Note: This installs requirements directly. It is simpler and more reliable
# for local builds, but the image will be larger because ML packages (torch,
# transformers) are installed into the final image.

FROM python:3.11-slim

WORKDIR /app

# Install build/runtime dependencies required for some packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements (from backend directory) and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./

# Create non-root user for security and drop privileges
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port the app listens on
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start the app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "wsgi:app"]
