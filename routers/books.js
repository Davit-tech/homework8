import express from 'express';
import schemas from "../schemas/books.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";
import booksController from '../controllers/booksControllers.js';
import fileUpload from "../middlewares/fileUpload.js";
import userController from "../controllers/userControllers.js";

const router = express.Router();

// Views
router.get("/", booksController.getBooksView);
router.get("/createBook", booksController.getCreateBooksView);
router.get("/:bookId/update", booksController.getUpdateBooksView);

// API
router.get("/data", auth, validate(schemas.getBooks, "query"), booksController.getBooks);
router.post("/data", auth, fileUpload.single("bookCover"), validate(schemas.createBook, "body"), booksController.createBook);
router.put("/:bookId", auth, validate(schemas.updateBook, "body"), booksController.updateBook);
router.delete("/:bookId", auth, booksController.deleteBook);
router.post("/upload-bookCover", auth, fileUpload.single("avatar"), userController.postAvatar);


export default router;
