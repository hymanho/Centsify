from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import requests
import os
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app)

# Load the trained model using an absolute path
model_path = r'C:\Users\r7-1700\moneytracker\src\backend\Chatbot\expense_model.pkl'
vector_path = r'C:\Users\r7-1700\moneytracker\src\backend\Chatbot\tfidf_vectorizer.pkl'

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

# Initialize Hugging Face API
HUGGING_API_KEY = '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'
HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2'

def preprocess_text(text):
    """Convert text to feature vector using the same vectorizer."""
    if vectorizer is None:
        raise ValueError("Vectorizer is not loaded.")
    return vectorizer.transform([text])

def process_with_local_model(text):
    """Process text with the locally trained model and return a meaningful response."""
    if model is None:
        raise ValueError("Model is not loaded.")
    features = preprocess_text(text)
    prediction = model.predict(features)
    
    # Convert prediction to a standard Python type for JSON serialization
    prediction_result = str(prediction[0])  # Ensure it's a string

    # Example where prediction results in direct, meaningful text
    if prediction_result == '0':
        response = 'You have spent less than average this month. Great job on managing your expenses!'
    elif prediction_result == '1':
        response = 'Your spending is on track with your budget goals. Keep it up!'
    elif prediction_result == '2':
        response = 'It looks like you have exceeded your budget limit. Consider reviewing your spending habits.'
    else:
        response = 'I’m not sure about that. Can you provide more details?'

    return response

def generate_response(input_text):
    """Generate a response using GPT-2 from Hugging Face."""
    headers = {
        'Authorization': f'Bearer {HUGGING_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        "inputs": input_text
    }
    try:
        print(f"Sending request to Hugging Face: {payload}")  # Log the payload
        response = requests.post(HUGGING_FACE_API_URL, headers=headers, json=payload)
        print(f"Received Hugging Face status code: {response.status_code}")  # Log status code
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Hugging Face Response: {response_data}")  # Log the Hugging Face response
            
            # Extract and return the generated text
            if isinstance(response_data, list) and len(response_data) > 0:
                generated_text = response_data[0]['generated_text']
                return generated_text
            else:
                return "Sorry, I couldn't generate a response at the moment."
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
        data = request.json
        user_message = data.get('message')
        user_data = data.get('data', {})

        print(f"Received message: {user_message}")  # Log the received message
        print(f"Received user data: {user_data}")  # Log the received user data

        if not user_message:
            return jsonify({"error": "No message provided"})

        # Use local model if available
        if model is not None:
            response_text = generate_response(user_message)
        else:
            # Use Hugging Face API if local model is not available
            response_text = process_with_local_model(user_message)
        
        print(f"Generated response: {response_text}")  # Log the response being sent back
        return jsonify({"response": response_text})

    except Exception as e:
        print(f"Error in /chat endpoint: {e}")  # Log any errors during request handling
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
