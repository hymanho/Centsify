import os
import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    firebase_admin_key = os.getenv('FIREBASE_ADMIN_KEY')
    if not firebase_admin_key:
        raise ValueError("FIREBASE_ADMIN_KEY environment variable not set")

    # Write the key to a file
    with open('firebaseAdminKey.json', 'w') as key_file:
        key_file.write(firebase_admin_key)

    cred = credentials.Certificate('firebaseAdminKey.json')
    firebase_admin.initialize_app(cred)

def fetch_data_from_firestore():
    initialize_firebase()
    db = firestore.client()
    # Your Firestore fetch logic here
    # For example:
    docs = db.collection('your_collection').stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')

if __name__ == '__main__':
    fetch_data_from_firestore()