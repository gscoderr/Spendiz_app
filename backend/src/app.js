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

import cardRouter from './routes/card.route.js';
import authRouter from "./routes/auth.route.js";
import matchRoutes from "./routes/match.route.js";

// Route declarations
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cards",cardRouter);
app.use("/api/v1/match",matchRoutes);


export { app };
