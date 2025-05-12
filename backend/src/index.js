import express from 'express';
import "dotenv/config";
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import {connectDB} from './db/db.js';

const app = express();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use(cors());
app.use("/auth", authRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  connectDB();
});
