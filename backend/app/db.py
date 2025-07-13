# backend/app/db.py
from pymongo import MongoClient
import os

MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["azure_architectures"]
collection = db["architectures"]
collection.create_index("source_url", unique=True)

def insert_architecture(arch_data: dict):
    collection.insert_one(arch_data)

def get_all_architectures():
    return list(collection.find({}, {"_id": 0}))

def get_largest_page_value():
    result = collection.find_one(sort=[("page", -1)], projection={"page": 1, "_id": 0})
    return result["page"] if result and "page" in result else 0
