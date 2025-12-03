import axios from 'axios';

const BASE_URL = 'https://course.summitglobal.id/products';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { method, body } = req;

    try {
        if (method === 'GET') {
            const response = await axios.get(BASE_URL);
            res.status(response.status).json(response.data);
        } else if (method === 'POST') {
            const response = await axios.post(BASE_URL, body);
            res.status(response.status).json(response.data);
        } else if (method === 'PUT') {
            const { id, ...updateData } = body;
            const putUrl = `${BASE_URL}?id=${id}`;
            const response = await axios.put(putUrl, updateData);
            res.status(response.status).json(response.data);
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error(`Error processing ${req.method} request:`, error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.error || `Internal error in proxy for ${req.method}`;
        res.status(status).json({ error: message, details: error.message });
    }
}
