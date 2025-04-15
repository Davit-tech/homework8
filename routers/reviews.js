import express from 'express';
import auth from "../middlewares/auth.js";
import reviewController from '../controllers/reviewsControllers.js';
import schemas from "../schemas/reviews.js";
import validate from "../middlewares/validation.js";

const router = express.Router();

// Views
router.get("/:bookId/reviews", reviewController.getReviewsView);
router.get("/:bookId/createReviews", reviewController.getCreateReviewView);
router.get("/:bookId/reviews/:reviewId/reviews", reviewController.getUpdateReviewsView);

// API
router.get("/:bookId/reviews/data", auth, reviewController.getBookReviews);
router.post("/:bookId/reviews", auth, validate(schemas.createReview, "body"), reviewController.createReview);
router.put("/:bookId/reviews/:reviewId", auth, auth, validate(schemas.updateReview, "body"), reviewController.updateReview);
router.delete("/:bookId/reviews/:reviewId", auth, reviewController.deleteReview);

export default router;
