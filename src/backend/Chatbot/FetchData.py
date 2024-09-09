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
        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_admin_sdk_key)
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
        print(f"An error occurred while fetching data from {collection_name}: {e}")
        return []

def fetch_expenses_for_account(account_id):
    """Fetch expenses for a specific account."""
    try:
        db = firestore.client()
        expenses_ref = db.collection('Accounts').document(account_id).collection('Expenses')
        docs = expenses_ref.stream()

        expenses = []
        for doc in docs:
            expense_data = convert_firestore_types(doc.to_dict())  # Handle special types
            expenses.append(expense_data)

        return expenses
    except Exception as e:
        print(f"An error occurred while fetching expenses for account {account_id}: {e}")
        return []

def save_data_to_file(data, filename):
    """Save data to a JSON file."""
    try:
        with open(filename, 'w') as outfile:
            json.dump(data, outfile, indent=4)
        print(f"Data saved to {filename}")
    except Exception as e:
        print(f"An error occurred while saving data to {filename}: {e}")

if __name__ == "__main__":
    initialize_firebase()
    collection_name = 'Accounts'
    data = fetch_data(collection_name)
    print(f"Data fetched and saved to expenses.json")