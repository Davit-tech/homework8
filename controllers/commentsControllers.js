import {Comments, Users} from "../models/index.js";

export default {
    async postComment(req, res) {
        try {
            const userId = req.userId;
            const {reviewId} = req.params;
            const {comments} = req.body;

            const newComment = await Comments.create({
                comments,
                user_id: userId,
                review_id: reviewId
            });

            res.status(201).json(newComment);
        } catch (error) {
            console.error("Error creating comment:", error);
            res.status(500).json({message: "Server error"});
        }
    },

    async getComments(req, res) {
        try {
            const {reviewId} = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const offset = (page - 1) * limit;

            const comments = await Comments.findAll({
                where: {review_id: reviewId},
                include: {
                    model: Users,
                    attributes: ["id", "username"],
                    as: "user"
                },
                order: [["createdAt", "ASC"]],
                limit,
                offset
            });

            const total = await Comments.count({where: {review_id: reviewId}});

            res.status(200).json({
                comments,
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error("Error fetching comments:", error);
            res.status(500).json({message: "Server error"});
        }
    }
};
