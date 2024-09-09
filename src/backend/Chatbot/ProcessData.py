import json
import pandas as pd
from datetime import datetime

def process_expense_data(file_path):
    """Process expense data from JSON file."""
    with open(file_path, 'r') as f:
        raw_data = json.load(f)

    # Convert to DataFrame for easier manipulation
    df = pd.DataFrame(raw_data)
    
    # Convert timestamp to datetime and extract month for analysis
    df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')
    df['month'] = df['date'].dt.month
    
    # Example: aggregate by categories
    category_summary = df.groupby('category')['amount'].sum().reset_index()

    return category_summary

if __name__ == "__main__":
    processed_data = process_expense_data('expenses.json')
    
    # Save processed data to a file
    processed_data.to_csv('processed_expenses.csv', index=False)
    
    print("Expense data processed and saved to processed_expenses.csv")