import {Books, Reviews, Favorites} from "../models/index.js";
import createError from "http-errors";
import {col, fn, Op} from "sequelize";


export default {
    // Views for Books
    async getBooksView(req, res) {
        res.render("books/books");
    },

    async getCreateBooksView(req, res) {
        res.render("books/createBook");
    },

    async getUpdateBooksView(req, res) {
        res.render("books/updateBook");
    },

    // API for Books
    async getBooks(req, res, next) {
        try {
            const q = req.query.q;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;

            const offset = (page - 1) * limit;
            const whereClause = q
                ? {
                    [Op.or]: [
                        {title: {[Op.like]: `%${q}%`}},
                        {description: {[Op.like]: `%${q}%`}},
                        {author: {[Op.like]: `%${q}%`}}
                    ]
                }
                : {};
            const booksData = await Books.findAll({
                limit,
                offset,
                where: whereClause,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: Reviews,
                        as: "reviews",
                        attributes: [],
                    },
                ],
                attributes: {
                    include: [
                        [fn("ROUND", fn("AVG", col("reviews.rating")), 1), "avgRating"]
                    ],
                },
                group: ["Books.id"],
                subQuery: false,
                raw: true,

            });
            const totalBooks = await Books.count();
            res.status(200).json({
                booksData,
                pagination: {
                    total: totalBooks,
                    page,
                    totalPages: Math.ceil(totalBooks / limit),

                },
            });
        } catch (err) {
            return next(createError("Error fetching books", err));
        }
    },

    async createBook(req, res, next) {

        try {
            const {title, author, description} = req.body;
            const userId = req.userId;
            const file = req.file;


            if (!userId) {
                return res.status(400).json({error: "User ID is missing. Please log in first."});
            }
            const avatarPath = file.path.replace("public/uploads", "");
            const booksData = await Books.create({
                userId: userId,
                title,
                author,
                description,
                bookCover: avatarPath,

            });
            res.status(200).json({booksData, success: true});
        } catch (err) {
            return next(createError("Error creating book", err));
        }
    },

    async updateBook(req, res) {
        try {
            const {bookId} = req.params;
            const userId = req.userId;
            const {title, author, description} = req.body;

            const book = await Books.findByPk(bookId);
            if (!book) return res.status(404).json({message: "Book not found"});
            if (book.userId !== userId) {
                return res.status(403).json({message: "You are not authorized to update this book"});
            }
            await book.update({title, author, description});
            res.status(200).json({message: "Book updated successfully", book});
        } catch (err) {
            res.status(500).json({message: "Error updating book", error: err.message});
        }
    },

    async deleteBook(req, res) {
        try {
            const {bookId} = req.params;
            const userId = req.userId;

            const book = await Books.findByPk(bookId);
            if (!book) return res.status(404).json({message: "Book not found"});
            if (book.userId !== userId) {
                return res.status(403).json({message: "You are not authorized to delete this book"});
            }
            // await Favorites.destroy({ where: { bookId } });
            await book.destroy();
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json({message: "Error deleting book", error: err.message});
        }
    },

};
