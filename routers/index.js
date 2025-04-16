import express from 'express';

const router = express.Router();
import userRouter from "./users.js";
import bookRouter from "./books.js";
import reviewRouter from "./reviews.js";


router.use("/user", userRouter);
router.use("/books", bookRouter);
router.use("/books", reviewRouter);
router.get("/", (req, res) => {
    res.render("home",);
});


export default router;