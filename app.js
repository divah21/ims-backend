import express from "express";
import { Model } from "objection";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import knexConfig from "./knexfile.js";
import Knex from "knex";
import bodyParser from "body-parser";
import authRouter from "./routes/user.routes.js";
import newsfeedRouter from "./routes/newsfeed.router.js";
import departmentRouter from "./routes/department.router.js";
import incidentRouter from "./routes/incident.routes.js";

import path from "path";

import { PORT } from "./config/env.js";

const app = express();
const knex = Knex(knexConfig.development);
Model.knex(knex);

// Middleware
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/newsfeeds", newsfeedRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/incidents", incidentRouter);

// Serve uploaded images
app.use("/newsfeed-images", express.static("C:/Users/David.Smart/Documents/Dallaglio/newsfeed/"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
