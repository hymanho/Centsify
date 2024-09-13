import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase():
    """
    Initialize Firebase application with the service account key.
    """
    try:
        # Load Firebase Admin SDK key from environment variable
        firebase_admin_sdk_key = json.loads(os.getenv('FIREBASE_ADMIN_SDK_KEY'))
        
        cred = credentials.Certificate(firebase_admin_sdk_key)
        firebase_admin.initialize_app(cred)
        print("Firebase Initialized")
        
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

def convert_firestore_types(data):
    """
    Convert Firestore types to JSON serializable types.
    
    Args:
    data (any): Data from Firestore to be converted.

    Returns:
    any: Converted data.
    """
    if isinstance(data, dict):
        return {k: convert_firestore_types(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_firestore_types(item) for item in data]
    elif hasattr(data, 'isoformat'):
        return data.isoformat()
    return data

def fetch_expenses_data(doc_id, collection_name):
    """
    Fetch all data from the 'expenses' subcollection and the 'expenseContainer' document for a specific account.

    Args:
    doc_id (str): The document ID of the account.
    collection_name (str): The name of the main Firestore collection.

    Returns:
    dict: Combined data from the 'expenses' subcollection including the 'expenseContainer' document.
    """
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

def fetch_data(collection_name):
    """
    Fetch all documents from a Firestore collection and include data from 'expenses' subcollection.

    Args:
    collection_name (str): The name of the Firestore collection to fetch.

    Returns:
    list: List of documents including data from the 'expenses' subcollection and 'expenseContainer' document.
    """
    try:
        db = firestore.client()
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()

        data = []
        for doc in docs:
            doc_data = convert_firestore_types(doc.to_dict())
            doc_id = doc.id
            # Fetch data from 'expenses' subcollection and 'expenseContainer' document
            expenses_data = fetch_expenses_data(doc_id, collection_name)
            doc_data['Expenses'] = expenses_data
            data.append(doc_data)
            print(f"Fetched document ID: {doc_id}")

        with open('account_data', 'w') as outfile:
            json.dump(data, outfile, indent=4)

        print(f"Fetched {len(data)} documents from the {collection_name} collection.")
        return data
    except Exception as e:
        print(f"An error occurred while fetching data: {e}")
        return []

if __name__ == "__main__":
    initialize_firebase()
    collection_name = 'Accounts'  # Adjust this if needed to match your Firestore collection name
    data = fetch_data(collection_name)
    print(f"Data fetched and saved to accounts_with_expenses.json")