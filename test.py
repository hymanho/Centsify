import pandas as pd
import os
import tkinter as tk
from tkinter import messagebox
from tkinter import ttk

# Define the file path
file_path = 'expenses.csv'

# Check if the file exists, if not create it with the appropriate headers
if not os.path.exists(file_path):
    df = pd.DataFrame(columns=['Date', 'Category', 'Description', 'Amount'])
    df.to_csv(file_path, index=False)

def add_expense(date, category, description, amount):
    df = pd.read_csv(file_path)
    new_expense = pd.DataFrame([[date, category, description, amount]], columns=['Date', 'Category', 'Description', 'Amount'])
    df = pd.concat([df, new_expense], ignore_index=True)
    df.to_csv(file_path, index=False)
    messagebox.showinfo("Success", "Expense added successfully!")

def view_expenses():
    df = pd.read_csv(file_path)
    return df

def add_expense_ui():
    date = date_entry.get()
    category = category_entry.get()
    description = description_entry.get()
    amount = amount_entry.get()

    if date and category and description and amount:
        try:
            float(amount)
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid amount")
            return

        add_expense(date, category, description, amount)
        date_entry.delete(0, tk.END)
        category_entry.delete(0, tk.END)
        description_entry.delete(0, tk.END)
        amount_entry.delete(0, tk.END)
    else:
        messagebox.showerror("Error", "Please fill in all fields")

def view_expenses_ui():
    df = view_expenses()
    for row in tree.get_children():
        tree.delete(row)
    for idx, row in df.iterrows():
        tree.insert("", tk.END, values=list(row))

# Setting up the GUI
root = tk.Tk()
root.title("Expense Tracker")

frame = tk.Frame(root)
frame.pack(pady=20)

date_label = tk.Label(frame, text="Date (YYYY-MM-DD):")
date_label.grid(row=0, column=0)
date_entry = tk.Entry(frame)
date_entry.grid(row=0, column=1)

category_label = tk.Label(frame, text="Category:")
category_label.grid(row=1, column=0)
category_entry = tk.Entry(frame)
category_entry.grid(row=1, column=1)

description_label = tk.Label(frame, text="Description:")
description_label.grid(row=2, column=0)
description_entry = tk.Entry(frame)
description_entry.grid(row=2, column=1)

amount_label = tk.Label(frame, text="Amount:")
amount_label.grid(row=3, column=0)
amount_entry = tk.Entry(frame)
amount_entry.grid(row=3, column=1)

add_button = tk.Button(frame, text="Add Expense", command=add_expense_ui)
add_button.grid(row=4, columnspan=2, pady=10)

tree = ttk.Treeview(root, columns=("Date", "Category", "Description", "Amount"), show='headings')
tree.heading("Date", text="Date")
tree.heading("Category", text="Category")
tree.heading("Description", text="Description")
tree.heading("Amount", text="Amount")
tree.pack(pady=20)

view_button = tk.Button(root, text="View Expenses", command=view_expenses_ui)
view_button.pack(pady=10)

root.mainloop()