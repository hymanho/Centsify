import firebase_admin
from firebase_admin import credentials
def initialize_firebase():
    try:
        # Initialize Firebase Admin with the key file
        cred = credentials.Certificate('./firebaseAdminKey.json')
        firebase_admin.initialize_app(cred)
        print("Firebase Admin initialized successfully.")
    except Exception as e:
        print(f"Error initializing Firebase Admin: {e}")

# Run the test
initialize_firebase()