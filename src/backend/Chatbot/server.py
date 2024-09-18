from flask import Flask, jsonify
from login import get_current_user_id  # Import the function from your login module

app = Flask(__name__)

@app.route('/current-user-id', methods=['GET'])
def current_user_id():
    try:
        user_id = get_current_user_id()
        return jsonify({'user_id': user_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Your existing Flask routes

if __name__ == "__main__":
    app.run(port=5000)  # Make sure this matches the port you use in your React app
