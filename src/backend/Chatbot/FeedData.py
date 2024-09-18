import json

def load_expense_data(file_path='accounts_with_expenses.json'):
    """
    Load the expense data from a JSON file.

    Args:
    file_path (str): Path to the JSON file containing expense data.

    Returns:
    dict: Parsed JSON data.
    """
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        print("Expense data loaded successfully.")
        return data
    except Exception as e:
        print(f"Error loading expense data: {e}")
        return {}

def format_data_for_chatbot(data):
    """
    Format the expense data to a structure suitable for the chatbot.

    Args:
    data (dict): Raw data from the JSON file.

    Returns:
    dict: Formatted data.
    """
    # Example formatting; adjust according to your chatbot's requirements
    formatted_data = {}
    for account in data:
        email = account.get('email')
        if email:
            formatted_data[email] = account.get('Expenses', {}).get('expenseContainer', {}).get('expenses', [])
    return formatted_data

def feed_data_to_chatbot(data):
    """
    Feed the formatted expense data to the chatbot.

    Args:
    data (dict): Formatted expense data to send to the chatbot.
    """
    # Replace this with the actual code to send data to the chatbot
    print("Feeding data to chatbot...")
    # Example: print the data or send it to a server endpoint
    print(json.dumps(data, indent=4))