# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

app = FastAPI(
    title="Azure Architecture Scraper API",
    description="Scrapes and exposes Azure cloud reference architectures",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",  # CRA / Docker / FE
    "http://127.0.0.1:3000",
    "http://localhost:8000",  # Swagger UI
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # or ["*"] while you’re debugging
    allow_credentials=True,     # required if you’ll ever send cookies
    allow_methods=["*"],        # let Starlette handle OPTIONS for you
    allow_headers=["*"],
)
app.include_router(router)
