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

def fetch_data_from_collection(collection_name):
    """Fetch all documents from a Firestore collection and convert them to JSON serializable data."""
    try:
        db = firestore.client()
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()

        data = []
        for doc in docs:
            doc_data = convert_firestore_types(doc.to_dict())  # Handle special types
            data.append(doc_data)

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
    
    # Fetch and save account data
    accounts_data = fetch_data_from_collection('Accounts')
    save_data_to_file(accounts_data, 'accounts.json')
    
    # Fetch expenses for each account
    all_expenses = []
    for account in accounts_data:
        account_id = account.get('accountId')
        if account_id:
            expenses_data = fetch_expenses_for_account(account_id)
            for expense in expenses_data:
                expense['accountId'] = account_id  # Link expense to account
            all_expenses.extend(expenses_data)
    
    # Save all expenses data
    save_data_to_file(all_expenses, 'expenses.json')
    
    print("Data fetching completed.")
