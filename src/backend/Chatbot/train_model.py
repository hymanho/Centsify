from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import pickle

# Sample training data
training_data = ["sample text data", "another sample text"]
training_labels = [0, 1]  # Replace with your actual labels

# Initialize and fit the vectorizer
vectorizer = TfidfVectorizer()
X_train = vectorizer.fit_transform(training_data)

# Initialize and train the model
model = RandomForestClassifier()
model.fit(X_train, training_labels)

# Save the vectorizer
with open('tfidf_vectorizer.pkl', 'wb') as vectorizer_file:
    pickle.dump(vectorizer, vectorizer_file)

# Save the model
with open('expense_model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

print("Model and vectorizer have been saved.")