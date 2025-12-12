import React, { useState } from 'react';
import axios from 'axios';

const InputForm = () => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/inputs', { name, value });
            setMessage(response.data.message);
            setName('');
            setValue('');
        } catch (error) {
            setMessage('Error saving input');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Add Input</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="value">Value:</label>
                    <input
                        type="number"
                        id="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default InputForm;