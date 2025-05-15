import requests
import json
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth
from typing import List, Dict, Any

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

def clear_token():
    try:
        response = requests.post('http://localhost:5000/clear-token')
        response.raise_for_status()
        data = response.json()
        message = data.get('message')
        print(message)
        return message
    except requests.RequestException as e:
        print(f"Error clearing token: {e}")
        return None

def fetch_token():
    try:
        response = requests.get('http://localhost:5000/get-token')
        response.raise_for_status()
        data = response.json()
        token = data.get('token')
        if token:
            print(token)
            return token
        else:
            print("No token found.")
            return None
    except requests.RequestException as e:
        print(f"Error fetching token: {e}")
        return None
    
    

# Get current user ID using a token
def verify_token(token):
    try:
        decoded_token = auth.verify_id_token(token)
        print("Sucessfully verified token.")
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None

def get_UID_from_token(token):
    decoded_token = verify_token(token)
    if decoded_token:
        return decoded_token.get('uid')
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
    
def get_current_user_expenses(userID) -> List[Dict[str, Any]]:
    
    db = firestore.client()
    #initialize_firebase()

    # Query Firestore for expenses
    expenses_ref = db.collection('Accounts').document(userID).collection('expenses').document('expenseContainer').get()
    if not expenses_ref.exists:
        return []

    # Extract expenses data
    expenses_data = expenses_ref.to_dict().get('expenses', [])
    
    return expenses_data

if __name__ == "__main__":
    print()
    
    