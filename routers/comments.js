import express from 'express';

const router = express.Router();
import auth from "../middlewares/auth.js";

import commentController from '../controllers/commentsControllers.js';

router.post("/:reviewId/comments", auth, commentController.postComment)
router.get("/:reviewId/comments", commentController.getComments)

export default router;