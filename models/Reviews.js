import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";


class Reviews extends Model {
    static async createDefaults() {
        const defaultReviews = [
            {
                reviews: "Amazing book, highly recommend it!",
                rating: 5,
                user_id: 1,
                book_id: 1,
            },
            {
                reviews: "A great read, full of suspense.",
                rating: 4,
                user_id: 2,
                book_id: 2,
            },
            {
                reviews: "Not my favorite, but well-written.",
                rating: 3,
                user_id: 3,
                book_id: 3,
            },
            {
                reviews: "An all-time classic, loved every page.",
                rating: 5,
                user_id: 4,
                book_id: 4,
            },
            {
                reviews: "Too long for my taste, but good story.",
                rating: 3,
                user_id: 5,
                book_id: 5,
            },
            {
                reviews: "A masterpiece of literature, must-read!",
                rating: 5,
                user_id: 6,
                book_id: 6,
            },
            {
                reviews: "A little hard to follow, but intriguing.",
                rating: 4,
                user_id: 7,
                book_id: 7,
            },
            {
                reviews: "Great fantasy world, exciting plot!",
                rating: 4,
                user_id: 8,
                book_id: 8,
            },
            {
                reviews: "A bit too heavy-handed with the message.",
                rating: 3,
                user_id: 9,
                book_id: 9,
            },
            {
                reviews: "An emotional and gripping novel.",
                rating: 5,
                user_id: 10,
                book_id: 10,
            },
        ];

        for (const review of defaultReviews) {
            await Reviews.findOrCreate({
                where: {
                    user_id: review.user_id,
                    book_id: review.book_id
                },
                defaults: review,
            });
        }
        return {};
    }
}

Reviews.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    reviews: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    }
}, {
    sequelize: db,
    modelName: 'reviews',
    tableName: 'reviews',
    timestamps: true,
});

export default Reviews;
