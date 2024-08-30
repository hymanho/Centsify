import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    bot_response = generate_response(user_message)
    return jsonify({"response": bot_response})

def generate_response(message):
    try:
        headers = {
            'Authorization': f'Bearer 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'
        }

        data = {
            "inputs": message,
            "parameters": {"max_new_tokens": 150},
        }

        response = requests.post(
            'https://api-inference.huggingface.co/models/gpt2',
            headers=headers, json=data
        )
        
        response_json = response.json()
        return response_json[0]['generated_text'].strip() if 'generated_text' in response_json[0] else "I'm not sure how to respond to that."
    except Exception as e:
        return f"Sorry, I couldn't generate a response due to an error: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
