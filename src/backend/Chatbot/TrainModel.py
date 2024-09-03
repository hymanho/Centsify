from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments

# Load dataset
dataset = load_dataset('json', data_files='data/transformed_expenses_data.json')

# Initialize tokenizer
tokenizer = AutoTokenizer.from_pretrained('gpt-4')

def tokenize_function(examples):
    return tokenizer(examples['prompt'], truncation=True, padding='max_length', max_length=512)

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Load pre-trained model
model = AutoModelForCausalLM.from_pretrained('gpt-4')

# Define training arguments
training_args = TrainingArguments(
    output_dir="./model/fine-tuned-model",
    evaluation_strategy="epoch",
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
)

# Setup Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset['train'],
    eval_dataset=tokenized_dataset['test']
)

# Train the model
trainer.train()

# Save the model
model.save_pretrained('./model/fine-tuned-model')
tokenizer.save_pretrained('./model/fine-tuned-model')