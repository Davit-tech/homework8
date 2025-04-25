import {Favorites, Books} from "../models/index.js";


export default {


    async PostFavorites(req, res) {
        try {
            const {userId, bookId} = req.body;

            const exitsFavorites = await Favorites.findOne({
                where: {
                    userId: userId,
                    bookId: bookId,
                }
            })
            if (exitsFavorites) {
                return res.status(409).json({error: "Book already in favorites"});
            }

            const favorite = await Favorites.create({userId, bookId});
            res.status(200).json(favorite);


        } catch (error) {
            res.status(500).json({error: "Failed to add to favorites"});
        }

    },
    async deleteFavorites(req, res) {
        try {
            const {userId, bookId} = req.body;
            const favorite = await Favorites.findOne({
                where: {
                    userId: userId,
                    bookId: bookId,
                }
            });
            if (!favorite) {
                return res.status(404).json({error: "Book not found in favorites"});
            }
            await favorite.destroy();
            res.status(200).json({message: "Book deleted from favorites"});

        } catch (error) {
            res.status(500).json({error: "Failed to delete from favorites"});
        }
    }

}