import json

def transform_data(data):
    transformed_data = []
    for item in data:
        prompt = f"What was the expense description? {item.get('description', 'N/A')}"
        response = f"Amount spent: {item.get('amount', 'N/A')}"
        transformed_data.append({"prompt": prompt, "response": response})
    return transformed_data

if __name__ == "__main__":
    with open('data/dataset.json', 'r') as f:
        raw_data = json.load(f)
    
    transformed_data = transform_data(raw_data)
    
    with open('data/transformed_expenses_data.json', 'w') as f:
        json.dump(transformed_data, f, indent=4)