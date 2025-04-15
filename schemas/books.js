import joi from "joi";

export default {
    createBook: joi.object({
        title: joi.string().min(3).max(50).required(),
        author: joi.string().required(),
        description: joi.string().min(3).max(50).required(),
    }),
    updateBook: joi.object({
        title: joi.string().min(3).max(50).required(),
        author: joi.string().required(),
        description: joi.string().min(3).max(50).required(),
    })
};