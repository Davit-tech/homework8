import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";
import Users from "./Users.js";
import Books from "./Books.js";


class Reviews extends Model {
    static async createDefaults() {
        const defaultReviews = [
            {
                reviews: "Amazing book, highly recommend it!",
                rating: 5,
                userId: 1,
                bookId: 1,
            },
            {
                reviews: "A great read, full of suspense.",
                rating: 4,
                userId: 2,
                bookId: 2,
            },
            {
                reviews: "Not my favorite, but well-written.",
                rating: 3,
                userId: 3,
                bookId: 3,
            },
            {
                reviews: "An all-time classic, loved every page.",
                rating: 5,
                userId: 4,
                bookId: 4,
            },
            {
                reviews: "Too long for my taste, but good story.",
                rating: 3,
                userId: 5,
                bookId: 5,
            },
            {
                reviews: "A masterpiece of literature, must-read!",
                rating: 5,
                userId: 6,
                bookId: 6,
            },
            {
                reviews: "A little hard to follow, but intriguing.",
                rating: 4,
                userId: 7,
                bookId: 7,
            },
            {
                reviews: "Great fantasy world, exciting plot!",
                rating: 4,
                userId: 8,
                bookId: 8,
            },
            {
                reviews: "A bit too heavy-handed with the message.",
                rating: 3,
                userId: 9,
                bookId: 9,
            },
            {
                reviews: "An emotional and gripping novel.",
                rating: 5,
                userId: 10,
                bookId: 10,
            },
        ];

        for (const review of defaultReviews) {
            await Reviews.findOrCreate({
                where: {
                    userId: review.userId,
                    bookId: review.bookId
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
Users.hasMany(Reviews, {foreignKey: "userId", as: "reviews", onDelete: 'CASCADE'});
Reviews.belongsTo(Users, {foreignKey: "userId", as: "user"});

Books.hasMany(Reviews, {foreignKey: "bookId", as: "reviews", onDelete: 'CASCADE'});
Reviews.belongsTo(Books, {foreignKey: "bookId", as: "book"});
export default Reviews;
