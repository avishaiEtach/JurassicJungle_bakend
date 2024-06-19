import express from "express";
import mongoose from "mongoose";
import routes from "./routes";
import cors from "cors";
import { session, sessionConfig } from "./session";
const path = require("path");
require("./db/models");
require("dotenv").config();

const MONGO_URL =
  "mongodb+srv://etach89:cqBbh4ipinOPh3QF@cluster0.ust9ywt.mongodb.net/test2?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error));

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(express.json());

app.use(session(sessionConfig));

app.use("/", ...routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`sever running on http://localhost:${port}`);
});
