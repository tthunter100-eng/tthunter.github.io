require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./db');
const app = express();

app.use(express.json());

let db;

async function startServer() {
    try {
        db = await connectToDatabase();
        console.log("Connected to database successfully.");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database.", error);
        process.exit(1);
    }
}

app.get('/api/data', async (req, res) => {
    try {
        const collection = db.collection('items');
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        const collection = db.collection('items');
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

startServer();