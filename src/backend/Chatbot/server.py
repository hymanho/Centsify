from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import spacy
import requests
import os
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app)

# Load the trained model using an absolute path
try:
    model_path = r'C:\Users\Diljan\moneytracker\src\backend\Chatbot\expense_model.pkl'
    print(f"Attempting to load the model from: {model_path}")
    
    with open(model_path, 'rb') as model_file:
        expense_model = pickle.load(model_file)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    expense_model = None

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize Hugging Face API
HUGGING_API_KEY = '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'
HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2'

def preprocess_user_data(user_data):
    """Prepare user data for prediction."""
    features = [
        user_data.get('total_spent', 0),
        user_data.get('most_expensive_purchase_amount', 0),
        user_data.get('number_of_transactions', 0),
        user_data.get('average_transaction_amount', 0),
    ]
    return features

# Load your pre-trained model
def load_model():
    with open('expense_model.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
    return model

model = load_model()

# Create or load the vectorizer used during model training
vectorizer = TfidfVectorizer()  # Ensure this matches the one used for training

def preprocess_text(text):
    # Convert text to feature vector using the same vectorizer
    return vectorizer.transform([text])

def process_with_local_model(text):
    features = preprocess_text(text)
    processed_output = model.predict(features)
    return processed_output[0]

def generate_text_with_gpt2(input_text):
    headers = {
        'Authorization': f'Bearer {HUGGING_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        "inputs": message
    }
    try:
        print(f"Sending request to Hugging Face: {payload}")  # Log the payload
        response = requests.post(HUGGING_FACE_API_URL, headers=headers, json=payload)
        print(f"Received Hugging Face status code: {response.status_code}")  # Log status code
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Hugging Face Response: {response_data}")  # Log the Hugging Face response
            
            # Since response_data is a list, access the first element
            if isinstance(response_data, list) and len(response_data) > 0:
                first_item = response_data[0]
                # Access the 'generated_text' field
                generated_text = first_item.get('generated_text', 'No response generated')
                return generated_text
            else:
                return "No response generated"
        else:
            # Log errors and return error message
            print(f"Error from Hugging Face: {response.status_code}, {response.text}")
            return f"Error: {response.status_code}, {response.text}"
    except Exception as e:
        print(f"Exception during Hugging Face API call: {e}")
        return f"Error: {e}"



@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages and make predictions."""
    try:
        user_message = request.json.get('message')
        user_data = request.json.get('data', {})
        
        print(f"Received message: {user_message}")  # Log the received message
        print(f"Received user data: {user_data}")  # Log the received user data

        if expense_model is None:
            return jsonify({"error": "Model not loaded. Please check server logs for details."})

        # Use Hugging Face for message interpretation
        response_text = generate_response(user_message)
        print(f"Generated response: {response_text}")  # Log the response being sent back
        return jsonify({"response": response_text})

    except Exception as e:
        print(f"Error in /chat endpoint: {e}")  # Log any errors during request handling
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
