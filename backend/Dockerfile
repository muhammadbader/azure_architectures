# backend/Dockerfile
FROM python:3.11-slim

# System dependencies for Selenium + Chrome
RUN apt-get update && apt-get install -y \
    wget gnupg unzip curl \
    chromium chromium-driver \
    libnss3 libatk-bridge2.0-0 libx11-xcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxi6 \
    libxtst6 libxrandr2 libgbm1 libasound2 libxshmfence1 libgtk-3-0 \
    && apt-get clean


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app

RUN pip install --upgrade pip && pip install -r requirements.txt
COPY ./app /app/app

ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
