const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config({ path: '../database.env' });
const Catalog = require('../models/Catalog.cjs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for requests from http://localhost:8080
app.use(cors({
  origin: 'http://localhost:8080'
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Parse JSON bodies
app.use(bodyParser.json());

// Extract environment variables
const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.sendStatus(401); // Unauthorized if no token provided
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user;
        next();
    });
};



// Route to fetch catalog data
app.get('/catalog', async (req, res) => {
  const { filter, sortByName, sortByDate, search, page, limit } = req.query;

  try {
    let filterCondition = {};
    let sortCondition = {};

    // Apply filtering conditions based on filter value from select
    if (filter) {
      switch (filter) {
        case 'lastHour':
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          filterCondition.creationDate = { $gte: oneHourAgo };
          break;
        case 'yesterday':
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          filterCondition.creationDate = { $gte: yesterday, $lt: today };
          break;
        case 'lastWeek':
          const todayWeek = new Date();
          const lastWeek = new Date(todayWeek);
          lastWeek.setDate(todayWeek.getDate() - 7);
          filterCondition.creationDate = { $gte: lastWeek, $lt: todayWeek };
          break;
        default:
          break;
      }
    }

    // for search by mac adress
    if (search) {
      filterCondition.mac = { $regex: search, $options: 'i' };
    }

    // Default sorting condition: newest first by creation date
    let defaultSortCondition = { creationDate: -1 };

    // Apply sorting condition
    if (sortByName) {
      switch (sortByName) {
        case 'ascending':
          sortCondition = { name: 1 };
          break;
        case 'descending':
          sortCondition = { name: -1 };
          break;
        default:
          break;
      }
    } else if (sortByDate) {
      switch (sortByDate) {
        case 'ascending':
          sortCondition = { creationDate: 1 };
          break;
        case 'descending':
          sortCondition = { creationDate: -1 };
          break;
        default:
          break;
      }
    }

    // If no sorting condition is applied, use the default, use for display data by timing
    if (Object.keys(sortCondition).length === 0) {
      sortCondition = defaultSortCondition;
    }

    // Get total count of documents
    const totalCount = await Catalog.countDocuments(filterCondition);

    // Get data based on page and limit
    const currentPage = parseInt(page) || 1;
    const limitPerPage = parseInt(limit) || 10;

    const catalogData = await Catalog.find(filterCondition)
      .sort(sortCondition)
      .skip((currentPage - 1) * limitPerPage)
      .limit(limitPerPage);

    res.json({
      data: catalogData,
      totalCount: totalCount
    });
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle login requests
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Protected endpoint
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Protected endpoint' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
