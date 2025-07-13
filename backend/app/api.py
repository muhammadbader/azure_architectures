# backend/app/api.py
from fastapi import APIRouter
from app.db import get_all_architectures
from app.scraper import scrape_and_parse_all, get_architecture_results_count
from app.models import Architecture
from typing import List

router = APIRouter()

@router.get("/architectures", response_model=List[Architecture])
def list_architectures():
    return get_all_architectures()

@router.post("/scrape")
def trigger_scrape():
    scrape_and_parse_all()
    return {"status": "scrape complete"}

@router.get("/results_count")
def results_count():
    count = get_architecture_results_count()
    if count is not None:
        return {"Architectures count": count}
    return {"error": "Could not retrieve results count"}
