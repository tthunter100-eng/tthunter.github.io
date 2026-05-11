const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        
        return client.db('test_db');
    } catch (error) {
        console.error("Database connected failed:", error);
        throw error;
    }
}

module.exports = connectToDatabase;
