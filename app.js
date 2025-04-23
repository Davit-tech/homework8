import "dotenv/config.js";
import "./migrate.js";
import express from "express";
import morgan from "morgan";
import {resolve} from "path";
import router from "./routers/index.js";
import "./services/mail.js"

const app = express();

const {PORT} = process.env;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

app.use(express.static(resolve("public")));
app.set("view engine", "ejs");
app.set("views", resolve("views"));

app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});