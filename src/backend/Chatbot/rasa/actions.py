from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import statistics
from collections import Counter

# Import your predeveloped methods to pull the UID and fetch data
from FetchData import get_current_user_expenses, fetch_token, get_email_from_UID, get_UID_from_token, initialize_firebase

initialize_firebase()
token = fetch_token()
userID = get_email_from_UID(get_UID_from_token(token))

print(userID)

class ActionCheckExpenses(Action):
    def name(self) -> str:
        return "action_check_expenses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        expenses = get_current_user_expenses(userID)  # Fetch expenses from Firestore

        if not expenses:
            dispatcher.utter_message(text="No expenses found for this user.")
            return []

        total_expense = sum(expense['amount'] for expense in expenses)
        dispatcher.utter_message(text=f"You have spent a total of {total_expense} USD.")
        return []


class ActionComputeExpenseData(Action):
    def name(self) -> str:
        return "action_compute_expense_data"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        expenses = get_current_user_expenses(userID)  # Fetch expenses from Firestore

        if not expenses:
            dispatcher.utter_message(text="No expenses found for this user.")
            return []

        total_spent = sum(expense['amount'] for expense in expenses)
        expense_count = len(expenses)
        average_cost = total_spent / expense_count if expense_count else 0
        median_cost = statistics.median([expense['amount'] for expense in expenses]) if expenses else 0
        categories = [expense['category'] for expense in expenses]
        most_frequent_category = Counter(categories).most_common(1)[0][0] if categories else "None"
        most_expensive_expense = max(expenses, key=lambda x: x['amount']) if expenses else {}
        least_expensive_expense = min(expenses, key=lambda x: x['amount']) if expenses else {}

        summary_message = (
            f"Here are your expense statistics:\n"
            f"- Total spent: {total_spent} USD\n"
            f"- Number of expenses: {expense_count}\n"
            f"- Average cost: {average_cost:.2f} USD\n"
            f"- Median cost: {median_cost} USD\n"
            f"- Most frequent category: {most_frequent_category}\n"
            f"- Most expensive expense: {most_expensive_expense.get('title', 'N/A')} costing {most_expensive_expense.get('amount', 'N/A')} USD\n"
            f"- Least expensive expense: {least_expensive_expense.get('title', 'N/A')} costing {least_expensive_expense.get('amount', 'N/A')} USD"
        )

        dispatcher.utter_message(text=summary_message)
        return []


class ActionMostExpensiveExpense(Action):

    print(userID)

    def name(self) -> str:
        return "action_most_expensive_expense"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        expenses = get_current_user_expenses(userID)

        if not expenses:
            dispatcher.utter_message(text="No expenses found for this user.")
            return []

        most_expensive_expense = max(expenses, key=lambda x: x['amount'])
        dispatcher.utter_message(
            text=f"The most expensive expense is {most_expensive_expense['title']} costing {most_expensive_expense['amount']} USD."
        )
        return []


class ActionLeastExpensiveExpense(Action):
    def name(self) -> str:
        return "action_least_expensive_expense"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        expenses = get_current_user_expenses(userID)

        if not expenses:
            dispatcher.utter_message(text="No expenses found for this user.")
            return []

        least_expensive_expense = min(expenses, key=lambda x: x['amount'])
        dispatcher.utter_message(
            text=f"The least expensive expense is {least_expensive_expense['title']} costing {least_expensive_expense['amount']} USD."
        )
        return []