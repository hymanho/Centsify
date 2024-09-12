from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import spacy
import requests
import os
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def load_model():
    model_path = 'expense_model.pkl'
    full_path = os.path.abspath(model_path)
    print("Full Path to Model File:", full_path)
    if not os.path.isfile(full_path):
        print(f"Model file not found: {full_path}")
    with open(full_path, 'rb') as model_file:
        model = pickle.load(model_file)
        print("Model loaded sucessfully.")
    return model

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize Hugging Face API
HUGGING_API_KEY = 'hf_UgOfalrHWFsRmHthFtoycUwWmhKkuPqXoQb'
HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B'

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
    data = {'inputs': input_text}
    
    response = requests.post(HUGGING_FACE_API_URL, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()[0]['generated_text']
    else:
        return None, response.status_code, response.text

@app.route('/chat', methods=['POST'])
def chat():
    input_text = request.json.get('input_text')
    
    # Generate text with GPT-2
    gpt2_output, status_code, error_message = generate_text_with_gpt2(input_text)
    if gpt2_output:
        # Process the generated text with your local model
        processed_output = process_with_local_model(gpt2_output)
        return jsonify({'gpt2_output': gpt2_output, 'local_model_output': processed_output})
    else:
        return jsonify({'error': f'Failed to generate text with GPT-2: {error_message}'}), status_code

if __name__ == '__main__':
    app.run(debug=True)