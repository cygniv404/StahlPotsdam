from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()
MONGODB_URL = os.getenv('MONGODB_URL')


def init_db():
    client = MongoClient(MONGODB_URL)
    return client
