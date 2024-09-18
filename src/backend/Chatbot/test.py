"""
holds server.py code from last week 09/17/2024

"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import requests
import os
import json
from sklearn.feature_extraction.text import TfidfVectorizer

from FetchData import initialize_firebase

app = Flask(__name__)
CORS(app)
HUGGING_API_KEY = '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'
HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-1B-distill'

# Load the trained model using an absolute path

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'expense_model.pkl')
vector_path = os.path.join(base_dir, 'tfidf_vectorizer.pkl')

try:
    with open(model_path, 'rb') as model_file:
        model = pickle.load(model_file)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

try:
    with open(vector_path, 'rb') as vectorizer_file:
        vectorizer = pickle.load(vectorizer_file)
    print("Vectorizer loaded successfully.")
except Exception as e:
    print(f"Error loading vectorizer: {e}")
    vectorizer = None




# Initialize Firebase and fetch data

# Load JSON data into a global variable
json_file_path = 'accounts_with_expenses.json'

def load_json_data():
    """Load JSON data from the specified file."""
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            print("JSON data loaded successfully.")
            return data
    except Exception as e:
        print(f"Error loading JSON data: {e}")
        return {}

# Store JSON data in a global variable
chatbot_data = load_json_data()

def preprocess_text(text):
    """Convert text to feature vector using the vectorizer."""
    if vectorizer is None:
        raise ValueError("Vectorizer is not loaded.")
    return vectorizer.transform([text])

def process_with_local_model(text):
    """Process text with the locally trained model and return a response."""
    if model is None:
        return "I cannot analyze your expenses right now."

    features = preprocess_text(text)
    prediction = model.predict(features)
    prediction_result = str(prediction[0])

    if prediction_result == '0':
        return 'You have spent less than average this month. Great job on managing your expenses!'
    elif prediction_result == '1':
        return 'Your spending is on track with your budget goals. Keep it up!'
    elif prediction_result == '2':
        return 'It looks like you have exceeded your budget limit. Consider reviewing your spending habits.'
    else:
        return 'I’m not sure about that. Can you provide more details?'

def generate_response_with_gpt(input_text):
    """Generate a response using OpenAssistant from Hugging Face."""
    headers = {
        'Authorization': f'Bearer {HUGGING_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {"inputs": input_text}

    try:
        response = requests.post(HUGGING_FACE_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            response_data = response.json()
            if isinstance(response_data, list) and len(response_data) > 0:
                return response_data[0].get('generated_text', "I'm not sure how to respond to that.")
            else:
                return "Sorry, I couldn't generate a response."
        else:
            return f"Error: {response.status_code}, {response.text}"
    except Exception as e:
        return f"Error: {e}"

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages and provide responses."""
    try:
        data = request.json
        user_message = data.get('message')
        user_data = data.get('data', {})

        print(f"Received message: {user_message}")
        print(f"Received user data: {user_data}")

        if not user_message:
            return jsonify({"error": "No message provided"})

        # Use JSON data if needed for response generation
        # You can use chatbot_data here if needed for additional logic
        response_text = generate_response_with_gpt(user_message)
        
        print(f"Generated response: {response_text}")
        return jsonify({"response": response_text})

    except Exception as e:
        print(f"Error in /chat endpoint: {e}")
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)