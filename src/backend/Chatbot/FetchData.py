import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv
from google.cloud.firestore_v1 import DocumentSnapshot

# Load environment variables from .env file
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK using credentials from environment variable."""
    try:
        # Load Firebase Admin SDK key from the environment variable
        firebase_admin_sdk_key = json.loads(os.getenv('FIREBASE_ADMIN_SDK_KEY'))
        
        # Check if the Firebase app is already initialized
        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_admin_sdk_key)
            firebase_admin.initialize_app(cred)
            print("Firebase Initialized")
        else:
            print("Firebase already initialized")

    except Exception as e:
        print(f"Error initializing Firebase: {e}")

def convert_firestore_types(data):
    """Recursively converts Firestore-specific types (like DatetimeWithNanoseconds) into JSON serializable types."""
    if isinstance(data, DocumentSnapshot):
        data = data.to_dict()

    if isinstance(data, dict):
        for key, value in data.items():
            data[key] = convert_firestore_types(value)
    elif isinstance(data, list):
        data = [convert_firestore_types(item) for item in data]
    elif hasattr(data, 'isoformat'):  # This handles `DatetimeWithNanoseconds`
        return data.isoformat()

    return data

# Fetch Data from Firestore
def fetch_data(collection_name):
    """Fetch all documents from a Firestore collection and convert them to JSON serializable data."""
    try:
        db = firestore.client()
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()

        data = []
        for doc in docs:
            doc_data = convert_firestore_types(doc.to_dict())  # Handle special types
            data.append(doc_data)

        with open('expenses.json', 'w') as outfile:
            json.dump(data, outfile, indent=4)

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

