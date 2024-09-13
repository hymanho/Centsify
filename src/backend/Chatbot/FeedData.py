import json
import requests

def load_json_file(file_path):
    """
    Load JSON data from a file.

    Args:
    file_path (str): The path to the JSON file.

    Returns:
    dict: The loaded JSON data.
    """
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        print("JSON data loaded successfully.")
        return data
    except Exception as e:
        print(f"Error loading JSON file: {e}")
        return {}

def format_data_for_chatbot(data):
    """
    Format the JSON data for the chatbot. This function can be customized based on how
    you want to use the data in your chatbot.

    Args:
    data (dict): The JSON data loaded from the file.

    Returns:
    str: A formatted string representation of the data suitable for the chatbot.
    """
    formatted_data = ""
    for account in data:
        user_name = account.get('name', 'Unknown')
        email = account.get('email', 'No email')
        expenses = account.get('Expenses', {}).get('expenseContainer', {}).get('expenses', [])

        formatted_data += f"User: {user_name}\nEmail: {email}\nExpenses:\n"
        if expenses:
            for expense in expenses:
                description = expense.get('description', 'No description')
                date = expense.get('date', 'No date')
                title = expense.get('title', 'No title')
                amount = expense.get('amount', 0)
                category = expense.get('category', 'No category')
                formatted_data += f"  - Title: {title}, Date: {date}, Amount: ${amount}, Category: {category}, Description: {description}\n"
        else:
            formatted_data += "  No expenses found.\n"

        formatted_data += "\n"

    return formatted_data

def send_data_to_chatbot(formatted_data):
    """
    Send the formatted data to the chatbot API.

    Args:
    formatted_data (str): The formatted string data to be sent to the chatbot.

    Returns:
    None
    """
    chatbot_url = 'http://localhost:5000/chat'  # Replace with your chatbot's URL
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {
        'message': formatted_data
    }

    try:
        response = requests.post(chatbot_url, headers=headers, json=payload)
        if response.status_code == 200:
            print("Data successfully sent to the chatbot.")
        else:
            print(f"Failed to send data. Status code: {response.status_code}")
            print("Response:", response.text)
    except Exception as e:
        print(f"Error sending data to chatbot: {e}")

def main():
    json_file_path = 'accounts_with_expenses.json'  # Path to your JSON file
    data = load_json_file(json_file_path)
    if data:
        formatted_data = format_data_for_chatbot(data)
        send_data_to_chatbot(formatted_data)

if __name__ == "__main__":
    main()