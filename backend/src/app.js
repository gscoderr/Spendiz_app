// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./corn.service.js"; // ⬅️ Add this line to auto-start cron when app runs


const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import cardRouter from './routes/card.route.js';
import authRouter from "./routes/auth.route.js";
import matchRoutes from "./routes/match.route.js";
import travelRoutes from "./routes/travel.route.js";
import offersRoutes from "./routes/offer.route.js";
import scraperRoutes from "./routes/scraper.route.js";
import dynamicRoutes from "./routes/dynamic.route.js";


// Route declarations
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cards",cardRouter);
app.use("/api/v1/match",matchRoutes);
app.use("/api/v1/travel", travelRoutes);
app.use("/api/v1/offers", offersRoutes);
app.use("/api/v1/scraper", scraperRoutes);
app.use("/api/dynamic", dynamicRoutes);



export { app };
