import {Favorites, Books} from "../models/index.js";


export default {


    async PostFavorites(req, res) {
        try {
            const {user_id, book_id} = req.body;

            const exitsFavorites = await Favorites.findOne({
                where: {
                    user_id: user_id,
                    book_id: book_id,
                }
            })
            if (exitsFavorites) {
                return res.status(409).json({error: "Book already in favorites"});
            }

            const favorite = await Favorites.create({user_id, book_id});
            res.status(200).json(favorite);


        } catch (error) {
            res.status(500).json({error: "Failed to add to favorites"});
        }

    }

}