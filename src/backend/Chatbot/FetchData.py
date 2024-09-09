#FetchData.py
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv
from google.cloud.firestore_v1 import DocumentSnapshot

load_dotenv()

def initialize_firebase():
    try:
        firebase_admin_sdk_key = json.loads(os.getenv('FIREBASE_ADMIN_SDK_KEY'))
        if not firebase_admin.apps:
            cred = credentials.Certificate(firebaseadminsdkkey)
            firebase_admin.initialize_app(cred)
            print("Firebase Initialized")
        else:
            print("Firebase already initialized")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

def convert_firestore_types(data):
    if isinstance(data, DocumentSnapshot):
        data = data.to_dict()
    if isinstance(data, dict):
        return {k: convert_firestore_types(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_firestore_types(item) for item in data]
    elif hasattr(data, 'isoformat'):
        return data.isoformat()
    return data

def fetch_data(collection_name):
    try:
        db = firestore.client()
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()

        data = [convert_firestore_types(doc.to_dict()) for doc in docs]

        with open('expenses.json', 'w') as outfile:
            json.dump(data, outfile, indent=4)

        print(f"Fetched {len(data)} documents from the {collection_name} collection.")
        return data
    except Exception as e:
        print(f"An error occurred while fetching data: {e}")
        return []

if __name__ == "__main__":
    initialize_firebase()
    collection_name = 'Accounts'
    data = fetch_data(collection_name)
    print(f"Data fetched and saved to expenses.json")