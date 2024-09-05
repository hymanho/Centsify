import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Initialize Firebase
def initialize_firebase():
    # Path to your service account JSON file

    firebase_admin_sdk_key = json.loads(os.getenv('FIREBASE_ADMIN_SDK_KEY'))

    # Initialize Firebase Admin SDK with the service account JSON key
    cred = credentials.Certificate(firebase_admin_sdk_key)
    firebase_admin.initialize_app(cred)
    print("Firebase Initialized")

# Fetch Data from Firestore
def fetch_data(collection_name):
    try:
        db = firestore.client()
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()

        data = []
        for doc in docs:
            data.append(doc.to_dict())
        
        print(f"Fetched {len(data)} documents from the {collection_name} collection.")
        return data

    except Exception as e:
        print(f"An error occurred while fetching data: {e}")
        return []

if __name__ == "__main__":
    initialize_firebase()
    collection_name = 'Accounts'  # Modify based on your Firestore collection name
    data = fetch_data(collection_name)
    print(data)