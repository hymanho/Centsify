import json
from statistics import mean, median
from collections import Counter

def process_expense_data(data):
    # Extract expenses from the data
    expenses = data.get("Expenses", {}).get("expenseContainer", {}).get("expenses", [])
    
    # If there are no expenses, return an empty result
    if not expenses:
        return {}

    # Calculate total expenses, categories, and amounts
    total_amounts = [expense['amount'] for expense in expenses]
    categories = [expense['category'] for expense in expenses]
    
    # Finding average and median cost
    avg_cost = mean(total_amounts)
    median_cost = median(total_amounts)
    
    # Finding the most frequent category
    most_frequent_category = Counter(categories).most_common(1)[0][0]
    
    # Finding the most and least expensive expenses
    most_expensive_expense = max(expenses, key=lambda x: x['amount'])
    least_expensive_expense = min(expenses, key=lambda x: x['amount'])
    
    # Total amount spent
    total_spent = sum(total_amounts)
    
    # Count of expenses
    expense_count = len(expenses)

    # Prepare the result
    result = {
        "average_cost": avg_cost,
        "median_cost": median_cost,
        "most_frequent_category": most_frequent_category,
        "most_expensive_expense": most_expensive_expense,
        "least_expensive_expense": least_expensive_expense,
        "total_spent": total_spent,
        "expense_count": expense_count
    }
    
    return result

if __name__ == "__main__":
    # Load data from a JSON file
    input_file = "yurt@gmail.com_data.json"
    
    with open(input_file, "r") as f:
        data = json.load(f)
    
    # Process the data
    processed_data = process_expense_data(data)

    # Save the processed data to a JSON file
    output_file = "processed_expense_data.json"
    with open(output_file, "w") as f:
        json.dump(processed_data, f, indent=4)

    print(f"Processed data saved to {output_file}")