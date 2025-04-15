import express from 'express';
import schemas from "../schemas/books.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";
import booksController from '../controllers/booksControllers.js';

const router = express.Router();

// Views
router.get("/", booksController.getBooksView);
router.get("/createBook", booksController.getCreateBooksView);
router.get("/:bookId/update", booksController.getUpdateBooksView);

// API
router.get("/data", auth, booksController.getBooks);
router.post("/data", auth, validate(schemas.createBook, "body"), booksController.createBook);
router.put("/:bookId", auth, validate(schemas.updateBook, "body"), booksController.updateBook);
router.delete("/:bookId", auth, booksController.deleteBook);

export default router;
