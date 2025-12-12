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

// Catch-all route to serve the React app for all other routes
app.get('/Sigmapay/*', (req, res) => {
    console.log('Catch-all route hit, serving index.html for path:', req.path);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Additional catch-all route for direct dashboard access
app.get('/dashboard', (_req, res) => {
    console.log('Redirecting /dashboard to /Sigmapay/#/dashboard');
    res.redirect('/Sigmapay/#/dashboard');
});

// General catch-all route for any other routes that should be handled by the React app
app.get('*', (req, res) => {
    console.log('General catch-all route hit, redirecting to Sigmapay for path:', req.path);
    res.redirect('/Sigmapay/');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`React app is available at http://localhost:${PORT}/Sigmapay/`);
});