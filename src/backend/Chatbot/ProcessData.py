#ProcessData.py
import json
import pandas as pd
from datetime import datetime

def process_expense_data(data):
    expenses = [item for account in data for item in account.get('expenses', [])]
    
    df = pd.DataFrame(expenses)
    
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    df['category'] = df['category'].str.lower()
    
    category_summary = df.groupby('category').agg({
        'amount': ['sum', 'mean', 'count'],
        'date': ['min', 'max']
    }).reset_index()
    
    category_summary.columns = ['category', 'total_amount', 'average_amount', 'transaction_count', 'first_date', 'last_date']
    
    total_spent = df['amount'].sum()
    most_expensive_purchase = df.loc[df['amount'].idxmax()]
    most_frequent_category = df['category'].mode().iloc[0]
    
    insights = {
        'total_spent': total_spent,
        'most_expensive_purchase': {
            'amount': float(most_expensive_purchase['amount']),
            'category': most_expensive_purchase['category'],
            'title': most_expensive_purchase['title'],
            'date': most_expensive_purchase['date'].strftime('%Y-%m-%d')
        },
        'most_frequent_category': most_frequent_category,
        'category_breakdown': category_summary.to_dict(orient='records')
    }
    
    return insights

def load_firestore_data(file_path='expenses.json'):
    with open(file_path, 'r') as f:
        return json.load(f)

if __name__ == "__main__":
    firestore_data = load_firestore_data()
    processed_data = process_expense_data(firestore_data)
    
    with open('processed_expenses.json', 'w') as f:
        json.dump(processed_data, f, indent=2)
    
    print("Expense data processed and saved to processed_expenses.json")