import os
def test_env_variable():
    firebase_admin_key = os.getenv('FIREBASE_ADMIN_KEY')
    print(firebase_admin_key)

# Run the test
test_env_variable()