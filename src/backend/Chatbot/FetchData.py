import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase app
cred = credentials.Certificate('./firebaseAdminKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Fetch data from a specific collection
def fetch_data(collection_name):
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()
    
    data = []
    for doc in docs:
        data.append(doc.to_dict())
    
    return data

# Fetch data from the 'expenses' collection
expenses_data = fetch_data('expenses')