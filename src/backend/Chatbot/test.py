import os
import firebase_admin
from firebase_admin import credentials

# Check if the environment variable is set
if 'FIREBASE_ADMIN_SDK_KEY' not in os.environ:
    raise ValueError("FIREBASE_ADMIN_SDK_KEY environment variable not set")

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./firebaseAdminKey.json')
firebase_admin.initialize_app(cred)