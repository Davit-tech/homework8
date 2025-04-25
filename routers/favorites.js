import express from 'express';

const router = express.Router();
import favoriteController from '../controllers/favoritesContorllers.js';


router.post("/:bookId/favorites", favoriteController.PostFavorites)
router.delete("/:bookId/favorites", favoriteController.deleteFavorites)
export default router;