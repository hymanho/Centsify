import re
import string
import pandas as pd

class DataProcessor:
    def __init__(self, data):
        """
        Initialize the processor with data from Firestore.
        """
        if isinstance(data, list):
            self.data = pd.DataFrame(data, columns=['text'])  # Adjust based on your actual data structure
        else:
            raise ValueError("Unsupported data format.")

    def clean_text(self, text):
        """
        Clean the input text by removing unwanted characters, punctuations, and numbers.
        """
        text = text.lower()
        text = re.sub(r'\[.*?\]', '', text)  
        text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)  
        text = re.sub(r'\w*\d\w*', '', text)  
        text = re.sub(r'\s+', ' ', text).strip()  
        return text

    def process_data(self):
        """
        Clean and process the data.
        """
        self.data['cleaned_text'] = self.data['text'].apply(self.clean_text)
        return self.data

# Example usage
if __name__ == "__main__":
    sample_data = [{"text": "Hello World!"}, {"text": "Another example."}]  # Example input
    processor = DataProcessor(sample_data)
    cleaned_data = processor.process_data()
    print(cleaned_data)