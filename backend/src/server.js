// server.js
import { app } from "./app.js";
import { connectDB } from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://${HOST}:${PORT}`);
  });
});
