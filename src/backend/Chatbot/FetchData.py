import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

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

# Fetch Data from Firestore
def fetch_data(collection_name):
    """Fetch all documents from a Firestore collection."""
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