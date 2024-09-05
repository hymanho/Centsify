import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase():
    # Retrieve Firebase Admin SDK key from environment variable
    firebase_admin_key = os.getenv('FIREBASE_ADMIN_SDK_KEY')
    

    # Save the secret to a file
    with open('firebaseAdminKey.json', 'w') as file:
        file.write(firebase_admin_key)
    
    # Initialize Firebase
    cred = credentials.Certificate('firebaseAdminKey.json')
    firebase_admin.initialize_app(cred)

def fetch_data_from_firestore():
    initialize_firebase()

    db = firestore.client()
    # Replace 'your_collection' with the name of your Firestore collection
    docs = db.collection('Accounts').stream()

    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')

if __name__ == "__main__":
    fetch_data_from_firestore()