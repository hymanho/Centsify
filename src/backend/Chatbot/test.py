import requests
import json
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth
from typing import List, Dict, Any

load_dotenv()

def initialize_firebase():
    try:
        firebase_admin_sdk_key = json.loads(os.getenv('FIREBASE_ADMIN_SDK_KEY'))
        cred = credentials.Certificate(firebase_admin_sdk_key)
        firebase_admin.initialize_app(cred)
        print("Firebase Initialized")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")


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

def fetch_token():
    try:
        response = requests.get('http://localhost:5000/get-token')
        response.raise_for_status()
        data = response.json()
        token = data.get('token')
        if token:
            
            return token
        else:
            print("No token found.")
            return None
    except requests.RequestException as e:
        print(f"Error fetching token: {e}")
        return None

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

if __name__ == '__main__':
    initialize_firebase()
    uid = get_UID_from_token(fetch_token())
    print(uid)
    get_current_user_expenses(uid)
    

