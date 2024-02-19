const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../database.env' });

const Catalog = require('../models/Catalog.cjs');

const app = express();
const PORT = 4000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
    initializeData();
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use(cors({
    origin: 'http://localhost:8080'
}));

const initializeData = async () => {
    try {
        const count = await Catalog.countDocuments();
        if (count === 0) {
            console.log('Initializing data...');
            const entries = Array.from({ length: 10000 }, () => ({
                type: generateRandomType(),
                name: generateRandomName(),
                mac: generateRandomMAC(),
                ipv4: generateRandomIPv4(),
                online: Math.random() < 0.5,
                description: generateRandomDescription(),
                creationDate: generateRandomDate()
            }));
            await Catalog.insertMany(entries);
            console.log('Data initialized successfully.');
        } else {
            console.log('Data already initialized.');
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
};

const generateRandomType = () => {
    const types = ['Phone', 'PC', 'Tablet', 'Other'];
    return types[Math.floor(Math.random() * types.length)];
};

const generateRandomName = () => {
    const maxDescriptionLength = 30;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    while (result.length < maxDescriptionLength) {
        const wordLength = Math.floor(Math.random() * 10) + 1;
        let word = '';
        for (let j = 0; j < wordLength; j++) {
            word += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        // Check if adding a new word will exceed the maximum description length
        if (result.length + word.length + 1 > maxDescriptionLength) {
            break;
        }
        result += word + ' '; 
    }
    return result.trim(); 
};

const generateRandomMAC = () => {
    const hexChars = '0123456789ABCDEF';
    return Array.from({ length: 6 }, () =>
        Array.from({ length: 2 }, () => hexChars[Math.floor(Math.random() * 16)]).join('')
    ).join(':');
};

const generateRandomIPv4 = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
};

const generateRandomDescription = () => {
    const maxDescriptionLength = 256;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    while (result.length < maxDescriptionLength) {
        const wordLength = Math.floor(Math.random() * 10) + 1; 
        let word = '';
        for (let j = 0; j < wordLength; j++) {
            word += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        if (result.length + word.length + 1 > maxDescriptionLength) {
            break;
        }
        result += word + ' '; 
    }
    return result.trim(); 
};


const generateRandomDate = () => {
    const currentDate = new Date();
    const randomOffset = Math.floor(Math.random() * 21);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);

    const randomDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - randomOffset, randomHours, randomMinutes, randomSeconds);

    // Format date to "YYYY-MM-DDTHH:mm:ss.sssZ" string
    const formattedDate = randomDate.toISOString();

    return formattedDate;
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
