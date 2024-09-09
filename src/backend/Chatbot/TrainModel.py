from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments
from ProcessData import DataProcessor
from FetchData import initialize_firebase, fetch_data

def train_model(processed_data):
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
    model = GPT2LMHeadModel.from_pretrained('gpt2')

    tokenized_data = tokenizer(
        processed_data['cleaned_text'].tolist(),
        padding=True,
        truncation=True,
        return_tensors="pt"
    )

    training_args = TrainingArguments(
        output_dir="./results",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        save_steps=10_000,
        save_total_limit=2,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_data['input_ids']
    )

    trainer.train()

if __name__ == "__main__":
    initialize_firebase()
    raw_data = fetch_data('Accounts')  # Fetch Firestore data

    processor = DataProcessor(raw_data)
    processed_data = processor.process_data()

    train_model(processed_data)