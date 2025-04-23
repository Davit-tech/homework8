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
    }),
    getBooks: joi.object({
        page: joi.number().integer().min(1).max(1000).default(1),
        limit: joi.number().integer().min(5).max(20).default(20),
        orderBy: joi.string().valid("createdAt", "updatedAt", "avgRating").default("createdAt"),
        order: joi.string().valid("DESC", "ASC").default("DESC"),
    })


};
