import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/emailRoutes.js';
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: '10mb' }));
app.get('/', (req, res) => {
    res.send('Server is running with TypeScript and ES Modules!');
});
app.use('/api', emailRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
