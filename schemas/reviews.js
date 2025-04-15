import joi from "joi";

export default {
    createReview: joi.object({
        reviews: joi.string().min(3).max(50).required(),
        rating: joi.number().min(1).max(5).required(),

    }),
    updateReview: joi.object({
        reviews: joi.string().min(3).max(50).required(),
        rating: joi.number().min(1).max(5).required(),
    })
};