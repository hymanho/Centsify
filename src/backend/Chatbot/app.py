from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow cross-origin requests

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    bot_response = generate_response(user_message)
    return jsonify({"response": bot_response})

def generate_response(message):
    # Simple logic for generating a response
    if 'hello' in message.lower():
        return "Hi there! How can I assist you today?"
    elif 'bye' in message.lower():
        return "Goodbye! Have a great day!"
    else:
        return "I'm not sure how to respond to that. Can you try asking something else?"

if __name__ == '__main__':
    app.run(debug=True)