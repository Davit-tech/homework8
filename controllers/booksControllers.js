import {Books, Reviews} from "../models/index.js";
import createError from "http-errors";

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const offset = (page - 1) * limit;
        try {
            const booksData = await Books.findAll({
                limit,
                offset,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: Reviews,
                        as: "reviews",
                    },
                ],
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
        const {title, author, description} = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({error: "User ID is missing. Please log in first."});
        }

        try {
            const booksData = await Books.create({
                user_id: userId,
                title,
                author,
                description,
            });
            res.status(200).json({booksData, success: true});
        } catch (err) {
            return next(createError("Error creating book", err));
        }
    },

    async updateBook(req, res) {
        try {
            const {bookId} = req.params;
            const {title, author, description} = req.body;

            const book = await Books.findByPk(bookId);
            if (!book) return res.status(404).json({message: "Book not found"});

            await book.update({title, author, description});
            res.status(200).json({message: "Book updated successfully", book});
        } catch (err) {
            res.status(500).json({message: "Error updating book", error: err.message});
        }
    },

    async deleteBook(req, res) {
        try {
            const {bookId} = req.params;
            const book = await Books.findByPk(bookId);
            if (!book) return res.status(404).json({message: "Book not found"});

            await book.destroy();
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json({message: "Error deleting book", error: err.message});
        }
    },
};