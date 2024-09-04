import os
def test_env_variable():
    firebase_admin_key = os.getenv('FIREBASE_ADMIN_KEY')
    
    if firebase_admin_key:
        print("Successfully pulled FIREBASE_ADMIN_KEY from environment variables.")
        # Optional: For debugging purposes, print the first few characters of the secret (avoid printing the full secret for security reasons)
        print(f"First 50 characters of FIREBASE_ADMIN_KEY: {firebase_admin_key[:50]}")
    else:
        print("FIREBASE_ADMIN_KEY environment variable is not set.")

# Run the test
test_env_variable()