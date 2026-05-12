require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const app = express();
const dns = require('node:dns/promises');
const { ObjectId } = require('mongodb');

dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.use(cors());
app.use(express.json());

let db;

async function startServer() {
    try {
        console.log("Attempting to connect to MongoDB...");
        db = await connectToDatabase(); 
        
        console.log("Connected to database successfully.");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Connection Error Detail:", error.message);
        console.log("Retrying connection in 5 seconds...");
        setTimeout(startServer, 5000);
    }
}

async function getDb() {
    if (!db) {
        db = await connectToDatabase();
    }
    return db;
}

app.get('/api/inventory', async (req, res) => {
    try {
        const database = await getDb();
        const collection = database.collection('items');
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const database = await getDb();
        const collection = database.collection('items');
        const newItem = { ...req.body };
        const result = await collection.insertOne(newItem);
        newItem._id = result.insertedId;
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const database = await getDb();
        const result = await database.collection('items').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tickets', async (req, res) => {
    try {
        const database = await getDb(); // ADD THIS
        const collection = database.collection('tickets');
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tickets', async (req, res) => {
    try {
        const database = await getDb(); // ADD THIS
        const collection = database.collection('tickets');
        const newTicket = { ...req.body };
        const result = await collection.insertOne(newTicket);
        newTicket._id = result.insertedId;
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tickets/:id', async (req, res) => {
    try {
        const database = await getDb();
        const result = await database.collection('tickets').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const database = await getDb();
        const result = await database.collection('items').deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tickets/:id', async (req, res) => {
    try {
        const database = await getDb();
        const result = await database.collection('tickets').deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

startServer();

module.exports = app;
