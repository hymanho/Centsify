const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const use = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs-node');
const admin = require('firebase-admin');

// Load Firebase service account key (replace with your key file)
const serviceAccount = require("C:\Users\r7-1700\moneytracker\moneytracker-19a89-firebase-adminsdk-y602a-bdb538b409.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

let model;

const loadModel = async () => {
    model = await use.load();
    console.log('TensorFlow model loaded');
};

loadModel();

app.post('/api/chatbot', async (req, res) => {
    const { userMessage, userId } = req.body;

    if (!model) {
        return res.status(500).json({ error: 'Model not loaded yet' });
    }

    // Generate a response using TensorFlow model
    const sentences = [userMessage];
    const embeddings = await model.embed(sentences);
    const embeddingArray = embeddings.arraySync();

    // Simple example response
    const botResponse = `You said: ${userMessage}`;

    // Save the conversation to Firestore
    await db.collection('users').doc(userId).collection('conversations').add({
        userMessage: userMessage,
        botResponse: botResponse,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ response: botResponse });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});