from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the trained expense prediction model
with open('expense_model.pkl', 'rb') as model_file:
    expense_model = pickle.load(model_file)

def preprocess_user_data(user_data):
    """
    Preprocess user data to match the format used for training the model.
    Example: Convert to feature vector as expected by the model.
    """
    # Extract features from user data
    features = [
        user_data.get('total_spent', 0),
        user_data.get('most_expensive_purchase_amount', 0),
        user_data.get('number_of_transactions', 0),
        user_data.get('average_transaction_amount', 0),
        # Add other features here
    ]
    return features

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')  # Get the user's message
    user_data = request.json.get('data', {})  # Get the user data for prediction

    # Example logic for chatbot response based on user message
    if "predict my expenses" in user_message.lower():
        # Preprocess user data and predict expenses
        features = preprocess_user_data(user_data)
        predicted_expense = expense_model.predict([features])
        
        response = f"Based on your current data, your predicted expense is: ${predicted_expense[0]:.2f}."
        return jsonify({"response": response})
    
    return jsonify({"response": "I'm sorry, I didn't understand your request."})

if __name__ == '__main__':
    app.run(debug=True)