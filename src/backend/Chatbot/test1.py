import os

# Get the directory where server.py is located
base_dir = os.path.dirname(os.path.abspath(__file__))

# Get the absolute paths of the .pkl files
expense_model_path = os.path.join(base_dir, 'expense_model.pkl')
tldf_vectorizer_path = os.path.join(base_dir, 'tldf_vectorizer.pkl')

print(f"Expense model absolute path: {expense_model_path}")
print(f"TF-IDF vectorizer absolute path: {tldf_vectorizer_path}")