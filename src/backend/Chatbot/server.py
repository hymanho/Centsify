from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import spacy
import openai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    with open('expense_model.pkl', 'rb') as model_file:
        expense_model = pickle.load(model_file)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    expense_model = None

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize OpenAI API
openai.api_key = 'HUGGING_API_KEY'

def preprocess_user_data(user_data):
    """Prepare user data for prediction."""
    features = [
        user_data.get('total_spent', 0),
        user_data.get('most_expensive_purchase_amount', 0),
        user_data.get('number_of_transactions', 0),
        user_data.get('average_transaction_amount', 0),
    ]
    return features

def interpret_message(message):
    """Analyze the user's message to determine their intent and extract relevant data."""
    doc = nlp(message)
    intent = ""
    if "predict" in message.lower() and "expenses" in message.lower():
        intent = "predict_expenses"
    # Add more intents and data extraction as needed
    return intent

def generate_response(message):
    """Generate a response using OpenAI."""
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=message,
        max_tokens=150
    )
    return response.choices[0].text.strip()

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages and make predictions."""
    try:
        user_message = request.json.get('message')
        user_data = request.json.get('data', {})

        if expense_model is None:
            return jsonify({"error": "Model not loaded. Please check server logs for details."})

        # Use OpenAI for message interpretation
        response_text = generate_response(user_message)
        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)