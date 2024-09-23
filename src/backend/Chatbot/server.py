"""

REST API to allow the sending of Firestore token (used to identify accounts) data to different files within the project.
Communicates with Firestore to allow fetching, verification, and storing of token.

"""

from flask import Flask, request, jsonify
from flask_cors import CORS

global_token = None

app = Flask(__name__)
CORS(app)  

# Route to handle token storage; used upon user login
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

# Route to clear the token; used upon user logoff
@app.route('/clear-token', methods=['POST'])
def clear_token():
    global global_token
    global_token = None
    return jsonify({"message": "Token cleared successfully"}), 200

# Route to get the token; used to fetch token by other services
@app.route('/get-token', methods=['GET'])
def get_token():
    if global_token:
        return jsonify({"token": global_token}), 200
    return jsonify({"error": "No token found"}), 404

# Route to validate the token; ensures token is not expired and is valid
@app.route('/validate-token', methods=['POST'])
def validate_token():
    data = request.get_json()
    token = data.get('token')
    if token == global_token:
        return jsonify({"valid": True}), 200
    return jsonify({"valid": False}), 400

if __name__ == '__main__':
    app.run(debug=True)
