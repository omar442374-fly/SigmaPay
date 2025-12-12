# Backend API

## Overview

Sigmapay includes a simple backend API built with Express and MongoDB to handle data persistence and server-side operations. While the current implementation is primarily for demonstration purposes, it's designed to be expanded into a full-featured backend for a production application.

## Server Implementation

The server is implemented in `server.js` at the root of the project:

```javascript
// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Input from './models/Input.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Serve static files from the React app
app.use('/Sigmapay', express.static(path.join(__dirname, 'dist')));
console.log('Serving static files from:', path.join(__dirname, 'dist'));

// Basic Route
app.get('/', (_req, res) => {
    res.send('Backend is running');
});

// Add a route to handle input and save it to the database
app.post('/api/inputs', async (req, res) => {
    try {
        const { name, value } = req.body;
        const newInput = new Input({ name, value });
        await newInput.save();
        res.status(201).json({ message: 'Input saved successfully', data: newInput });
    } catch (error) {
        res.status(500).json({ message: 'Error saving input', error });
    }
});

// Get all inputs
app.get('/api/inputs', async (_req, res) => {
    try {
        const inputs = await Input.find().sort({ createdAt: -1 });
        res.status(200).json(inputs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inputs', error });
    }
});

// Catch-all route to return the React app
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`React app is available at http://localhost:${PORT}/Sigmapay/`);
});
```

## Database Models

The application uses MongoDB for data storage, with Mongoose as the ODM (Object Data Modeling) library. Currently, there is one model defined:

```javascript
// models/Input.js
import mongoose from 'mongoose';

const inputSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Input = mongoose.model('Input', inputSchema);

export default Input;
```

This model is used to store user inputs, such as income values, in the database.

## API Endpoints

The current API implementation includes the following endpoints:

### 1. Basic Route

```
GET /
```

Returns a simple message indicating that the backend is running.

### 2. Save Input

```
POST /api/inputs
```

Saves a new input to the database.

**Request Body:**
```json
{
  "name": "income",
  "value": 5000
}
```

**Response:**
```json
{
  "message": "Input saved successfully",
  "data": {
    "_id": "60f1b2b3c4d5e6f7g8h9i0j1",
    "name": "income",
    "value": 5000,
    "createdAt": "2023-07-15T12:34:56.789Z"
  }
}
```

### 3. Get All Inputs

```
GET /api/inputs
```

Returns all inputs from the database, sorted by creation date in descending order.

**Response:**
```json
[
  {
    "_id": "60f1b2b3c4d5e6f7g8h9i0j1",
    "name": "income",
    "value": 5000,
    "createdAt": "2023-07-15T12:34:56.789Z"
  },
  {
    "_id": "60f1b2b3c4d5e6f7g8h9i0j2",
    "name": "expense",
    "value": 1000,
    "createdAt": "2023-07-14T12:34:56.789Z"
  }
]
```

### 4. Catch-All Route

```
GET *
```

Returns the React app's index.html file for any route not explicitly defined. This allows the frontend routing to handle client-side navigation.

## Frontend Integration

The frontend interacts with the backend API using Axios. Here's an example of how the InputForm component sends data to the backend:

```jsx
// src/components/InputForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const InputForm = () => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/inputs', { name, value: Number(value) });
            setMessage(response.data.message);
            setName('');
            setValue('');
        } catch (error) {
            setMessage('Error saving input');
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Input Form</h2>
            {message && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="value">
                        Value
                    </label>
                    <input
                        id="value"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default InputForm;
```

## Environment Configuration

The backend uses environment variables for configuration, loaded using the dotenv package. These variables should be defined in a `.env` file at the root of the project:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sigmapay
PORT=5000
```

## Deployment Considerations

For deployment, the backend needs to be configured to serve the built React app and handle API requests. The current implementation includes:

1. Serving static files from the `dist` directory
2. A catch-all route to serve the React app's index.html for client-side routing
3. CORS middleware to allow cross-origin requests during development

In a production environment, additional considerations would include:

1. Secure environment variable management
2. Authentication middleware for protected routes
3. Rate limiting to prevent abuse
4. Error logging and monitoring
5. Database connection pooling and optimization

## Future Expansion

The current backend implementation is minimal, but it's designed to be expanded with additional features:

1. **User Authentication API**: Endpoints for user registration, login, and profile management
2. **Financial Data API**: Endpoints for managing budgets, expenses, and financial goals
3. **Reporting API**: Endpoints for generating financial reports
4. **Notification API**: Endpoints for managing user notifications
5. **Integration with External Financial Services**: APIs for connecting to banking and investment platforms

## Conclusion

The backend API provides a foundation for server-side functionality in the Sigmapay application. While the current implementation is primarily for demonstration purposes, it's designed to be expanded into a full-featured backend for a production application. The use of Express and MongoDB provides a flexible and scalable platform for future development.
