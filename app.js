import dotenv from "dotenv/config.js";
import "./migrate.js";
import express from "express";
import morgan from "morgan";
import path from "path";
import route from "./routers/index.js";

const app = express();

const {PORT} = process.env;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

const publicPath = path.resolve("public");
const viewsPath = path.resolve("views");
app.use(express.static(publicPath));
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(route);
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});