import express from 'express';
import cors from 'cors';
import invoiceRoutes from './routes/invoice.routes.js';

const app = express();

app.use(cors()); // 👈 ESTO ES CLAVE
app.use(express.json());

app.use('/api/invoices', invoiceRoutes);

export default app;
