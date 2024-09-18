from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List

import firebase_admin
from firebase_admin import credentials, firestore
import os

path_to_firebase_credentials = os.getenv('FIREBASE_ADMIN_SDK_KEY')

cred = credentials.Certificate(path_to_firebase_credentials)
firebase_admin.initialize_app(cred)
db = firestore.client()

class ActionAddExpense(Action):
    def name(self) -> str:
        return "action_add_expense"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        amount = tracker.get_slot("amount")
        category = tracker.get_slot("category")
        # Save the expense to your database or data store
        dispatcher.utter_message(text=f"Expense of {amount} for {category} added.")
        return []

class ActionCheckExpenses(Action):
    def name(self) -> str:
        return "action_check_expenses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Retrieve and summarize all expenses from your database
        total_expense = 100  # Replace with actual calculation
        dispatcher.utter_message(text=f"You have spent a total of {total_expense}.")
        return []

class ActionMostExpensiveExpense(Action):
    def name(self) -> str:
        return "action_most_expensive_expense"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Retrieve the most expensive expense from your database
        item = "dinner"  # Replace with actual data
        amount = 50  # Replace with actual data
        dispatcher.utter_message(text=f"The most expensive expense is {item} costing {amount}.")
        return []

class ActionLeastExpensiveExpense(Action):
    def name(self) -> str:
        return "action_least_expensive_expense"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Retrieve the least expensive expense from your database
        item = "coffee"  # Replace with actual data
        amount = 5  # Replace with actual data
        dispatcher.utter_message(text=f"The least expensive expense is {item} costing {amount}.")
        return []

class ActionTotalExpenditure(Action):
    def name(self) -> str:
        return "action_total_expenditure"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Retrieve the total expenditure from your database
        total_expenditure = 200  # Replace with actual data
        dispatcher.utter_message(text=f"You have spent a total of {total_expenditure} so far.")
        return []