from pymongo import MongoClient
import os

MONGODB_URL = os.getenv('MONGODB_URL')

def init_db():
    client = MongoClient(MONGODB_URL)
    db = client.stahlpotsdam
    return db