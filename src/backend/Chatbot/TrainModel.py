import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import json
import pickle

def load_data(file_path):
    """Load processed data from a JSON file."""
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Convert JSON data to a DataFrame
    df = pd.DataFrame(data['category_breakdown'])

    # Adding a 'month' column by extracting from 'first_date'
    df['month'] = pd.to_datetime(df['first_date']).dt.month
    
    return df

def train_expense_model(data):
    """Train a simple linear regression model to predict expenses."""
    if len(data) < 2:
        print("Not enough data for train-test split. Training on the full dataset.")
        X = pd.get_dummies(data[['month', 'category']], drop_first=True)
        y = data['total_amount']

        # Train on the full dataset
        model = LinearRegression()
        model.fit(X, y)
    else:
        # Use amount as the target, and month and category as features
        X = pd.get_dummies(data[['month', 'category']], drop_first=True)
        y = data['total_amount']
        
        # Split into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Create and train the model
        model = LinearRegression()
        model.fit(X_train, y_train)
        
        # Evaluate the model
        score = model.score(X_test, y_test)
        print(f"Model R^2 Score: {score}")
    
    return model

if __name__ == "__main__":
    processed_data = load_data('processed_expenses.json')
    
    if processed_data.empty:
        print("No data found to train the model.")
    else:
        model = train_expense_model(processed_data)
        
        # Save the trained model to a file
        with open('expense_model.pkl', 'wb') as model_file:
            pickle.dump(model, model_file)
        
        print("Expense prediction model trained and saved.")