import express from 'express';

const router = express.Router();
import userRouter from "./users.js";
import bookRouter from "./books.js";
import reviewRouter from "./reviews.js";
import favoriteRouter from "./favorites.js";
import commentRouter from "./comments.js";


router.use("/user", userRouter);
router.use("/books", bookRouter);
router.use("/books", reviewRouter);
router.use("/books", favoriteRouter);
router.use("/reviews", commentRouter)
router.get("/", (req, res) => {
    res.render("home",);
});


export default router;