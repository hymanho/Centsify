"""

API's to allow the sending of firestore token to different applications within the project,
in order to allow for account access

"""

from flask import Flask, request, jsonify
from flask_cors import CORS

global_token = None

app = Flask(__name__)
CORS(app)

# Route to handle token storage
@app.route('/store-token', methods=['POST'])
def store_token():
    global global_token
    data = request.get_json()
    token = data.get('token')
    global_token = token
    print(token)
    if not token:
        return jsonify({"error": "No token provided"}), 400
    return jsonify({"message": "Token received successfully"}), 200

# Route to clear the token
@app.route('/clear-token', methods=['POST'])
def clear_token():
    global global_token
    global_token = None
    return jsonify({"message": "Token cleared successfully"}), 200

# Route to get the token
@app.route('/get-token', methods=['GET'])
def get_token():
    if global_token:
        return jsonify({"token": global_token}), 200
    return jsonify({"error": "No token found"}), 404

# Route to validate the token
@app.route('/validate-token', methods=['POST'])
def validate_token():
    data = request.get_json()
    token = data.get('token')
    if token == global_token:
        return jsonify({"valid": True}), 200
    return jsonify({"valid": False}), 400

if __name__ == '__main__':
    app.run(debug=True)
