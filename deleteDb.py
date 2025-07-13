from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# Replace with your MongoDB connection string
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client["azure_architectures"]
collection = db["architectures"]

# Delete all documents where 'page' field does not exist
result = collection.delete_many({ "page": { "$exists": True } })

print(f"Deleted {result.deleted_count} documents.")
