import requests
import json
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

# Initialize Firebase
def initialize_firebase():
    try:
        firebase_admin_sdk_key = json.loads(os.getenv('FIREBASE_ADMIN_SDK_KEY'))
        cred = credentials.Certificate(firebase_admin_sdk_key)
        firebase_admin.initialize_app(cred)
        print("Firebase Initialized")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

# Get current user ID from backend API
def get_current_user_id():
    try:
        response = requests.get('http://localhost:5000/current-user-id')
        response.raise_for_status()
        data = response.json()
        return data.get('userId')
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user ID: {e}")
        return None

# Convert Firestore types to JSON serializable types
def convert_firestore_types(data):
    if isinstance(data, dict):
        return {k: convert_firestore_types(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_firestore_types(item) for item in data]
    elif hasattr(data, 'isoformat'):
        return data.isoformat()
    return data

# Fetch expenses data for a specific account
def fetch_expenses_data(doc_id, collection_name):
    try:
        db = firestore.client()
        expenses_data = {}
        expenses_ref = db.collection(collection_name).document(doc_id).collection('expenses')
        
        # Fetch all documents in the 'expenses' subcollection
        for expense_doc in expenses_ref.stream():
            expense_doc_data = convert_firestore_types(expense_doc.to_dict())
            expense_doc_id = expense_doc.id
            expenses_data[expense_doc_id] = expense_doc_data
        
        # Fetch 'expenseContainer' document
        expense_container_ref = expenses_ref.document('expenseContainer')
        expense_container_doc = expense_container_ref.get()

        if expense_container_doc.exists:
            expenses_data['expenseContainer'] = convert_firestore_types(expense_container_doc.to_dict())
        else:
            print(f"Warning: 'expenseContainer' document for account ID {doc_id} does not exist.")
            expenses_data['expenseContainer'] = {}

        return expenses_data
    except Exception as e:
        print(f"An error occurred while fetching data for account ID {doc_id}: {e}")
        return {}

# Fetch data for the current logged-in user
def fetch_data(collection_name):
    try:
        initialize_firebase()
        user_id = get_current_user_id()
        if user_id is None:
            print("No user is currently logged in.")
            return []

        db = firestore.client()
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()

        data = []
        for doc in docs:
            doc_data = convert_firestore_types(doc.to_dict())
            doc_id = doc.id
            if doc_id == user_id:  # Fetch only the data for the logged-in user
                expenses_data = fetch_expenses_data(doc_id, collection_name)
                doc_data['Expenses'] = expenses_data
                data.append(doc_data)
                print(f"Fetched document ID: {doc_id}")

        with open('account_data.json', 'w') as outfile:
            json.dump(data, outfile, indent=4)

        print(f"Fetched {len(data)} documents from the {collection_name} collection.")
        return data
    except Exception as e:
        print(f"An error occurred while fetching data: {e}")
        return []

if __name__ == "__main__":
    collection_name = 'Accounts'  # Adjust this if needed
    fetch_data(collection_name)