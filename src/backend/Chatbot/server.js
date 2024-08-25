// server.js

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { UniversalSentenceEncoder } = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebaseAdminKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Load the Universal Sentence Encoder model
let model;
(async () => {
  model = await UniversalSentenceEncoder.load();
})();

// Handle chatbot requests
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Process message using the Universal Sentence Encoder
    const response = await processMessage(message);
    return res.json({ reply: response });
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to process the message and generate a response
const processMessage = async (message) => {
  const sentences = ['Hello, how can I help you?', 'I am a chatbot.'];
  const embeddings = await Promise.all(sentences.map(sentence => model.embed(sentence)));

  if (message.toLowerCase().includes('hello')) {
    return 'Hi there! How can I assist you today?';
  } else {
    return 'Sorry, I didn\'t understand that.';
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});