// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import cardRoutes from './routes/card.routes.js';
import authRouter from "./routes/auth.routes.js";

// Route declarations
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/card",cardRoutes);


export { app };
