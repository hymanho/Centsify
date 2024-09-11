import json
import pandas as pd
from datetime import datetime

def process_expense_data(data):
    # Flatten the list of expenses across all accounts
    expenses = [item for account in data for item in account.get('expenses', [])]

    # Create a DataFrame from the list of expenses
    df = pd.DataFrame(expenses)

    if df.empty:
        print("No expense data available.")
        return {}

    # Convert columns to appropriate types
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)
    df['category'] = df['category'].str.lower().fillna('unknown')

    # Calculate total spent
    total_spent = df['amount'].sum()

    # Find the most expensive purchase
    most_expensive_purchase = df.loc[df['amount'].idxmax()] if not df.empty else None

    # Find the most frequent category
    most_frequent_category = df['category'].mode().iloc[0] if not df.empty else 'unknown'

    # Group by category and aggregate data
    category_summary = df.groupby('category').agg({
        'amount': ['sum', 'mean', 'count'],
        'date': ['min', 'max']
    }).reset_index()

    # Rename columns for clarity
    category_summary.columns = ['category', 'total_amount', 'average_amount', 'transaction_count', 'first_date', 'last_date']

    # Add a 'month' column by extracting the month from the 'first_date'
    category_summary['first_date'] = pd.to_datetime(category_summary['first_date'])
    category_summary['month'] = category_summary['first_date'].dt.month

    # Convert DataFrame to JSON serializable format
    category_summary['first_date'] = category_summary['first_date'].astype(str)
    category_summary['last_date'] = category_summary['last_date'].astype(str)

    # Handle the case when there's no data
    if most_expensive_purchase is not None:
        most_expensive = {
            'amount': float(most_expensive_purchase['amount']),
            'category': most_expensive_purchase['category'],
            'title': most_expensive_purchase.get('title', ''),
            'date': most_expensive_purchase['date'].strftime('%Y-%m-%d')
        }
    else:
        most_expensive = {
            'amount': 0,
            'category': 'unknown',
            'title': '',
            'date': ''
        }

    # Build insights dictionary
    insights = {
        'total_spent': float(total_spent),
        'most_expensive_purchase': most_expensive,
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