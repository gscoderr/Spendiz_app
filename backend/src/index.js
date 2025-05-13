import express from 'express';
import "dotenv/config";
import cors from 'cors';
import routes from './routes/auth.route.js';
import { connectDB } from './db/db.js';



const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// ✅ Middlewares FIRST
app.use(cors());
app.use(express.json()); // ✅ MUST come BEFORE routes
app.use(express.urlencoded({ extended: true }));

// ✅ Then mount routes
app.use("/auth", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  connectDB();
});

// import express from 'express';
// import 'dotenv/config';
// import cors from 'cors';
// import routes from './routes/auth.route.js';
// import { connectDB } from '../db/db.js';

// const app = express();
// const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || 'localhost';

// // ✅ Connect to MongoDB first
// connectDB();

// // ✅ Apply middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Route for OTP Auth
// app.use('/auth', routes);

// // ✅ Default health route
// app.get('/', (req, res) => {
//   res.send('✅ Spendiz Backend Running...');
// });

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
// });