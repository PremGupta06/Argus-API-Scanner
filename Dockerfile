FROM node:22-alpine AS ui
WORKDIR /ui
COPY ui/package*.json ./
RUN npm ci
COPY ui/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn
COPY scanner/ scanner/
COPY lab/ lab/
COPY api.py .
COPY --from=ui /ui/dist ui/dist
ENV DEMO_MODE=1 PYTHONUNBUFFERED=1
CMD gunicorn -w 1 --threads 8 -b 0.0.0.0:${PORT:-8000} api:app