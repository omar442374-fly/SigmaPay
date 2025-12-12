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