import {Reviews, Books, Users} from "../models/index.js";
import createError from "http-errors";

export default {
    // Views for Reviews
    async getReviewsView(req, res) {
        res.render("reviews/reviews");
    },

    async getCreateReviewView(req, res) {
        res.render("reviews/createReviews");
    },

    async getUpdateReviewsView(req, res) {
        res.render("reviews/updateReviews");
    },

    // API for Reviews
    async createReview(req, res, next) {
        const {bookId} = req.params;
        const {reviews, rating} = req.body;
        const userId = req.userId;

        try {
            const newReview = await Reviews.create({
                book_id: bookId,
                user_id: userId,
                reviews,
                rating: parseInt(rating),
            });

            res.status(201).json({success: true, review: newReview});
        } catch (err) {
            return next(createError("Error creating review", err));
        }
    },

    async getBookReviews(req, res, next) {
        const {bookId} = req.params;

        try {
            const book = await Books.findByPk(bookId, {
                include: [
                    {
                        model: Reviews,
                        as: "reviews",
                        include: [
                            {
                                model: Users,
                                as: "user",
                                attributes: ["id", "username", "email", "createdAt"],
                            },
                        ],
                    },
                ],
            });

            if (!book) {
                return res.status(404).json({message: "Book not found"});
            }

            res.status(200).json({
                bookId: book.id,
                title: book.title,
                author: book.author,
                reviews: book.reviews,
            });
        } catch (err) {
            return next(createError("Error fetching reviews", err));
        }
    },

    async updateReview(req, res) {
        try {
            const {reviewId} = req.params;
            const {reviews, rating} = req.body;

            const review = await Reviews.findByPk(reviewId);
            if (!review) return res.status(404).json({message: "Review not found"});

            await review.update({reviews, rating});
            res.status(200).json({message: "Review updated successfully", review});
        } catch (err) {
            res.status(500).json({message: "Error updating review", error: err.message});
        }
    },

    async deleteReview(req, res) {
        try {
            const {reviewId} = req.params;

            const review = await Reviews.findByPk(reviewId);
            if (!review) return res.status(404).json({message: "Review not found"});

            if (review.user_id !== req.userId) {
                return res.status(403).json({message: "You are not allowed to delete this review"});
            }

            await review.destroy();
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json({message: "Error deleting review", error: err.message});
        }
    },
};
