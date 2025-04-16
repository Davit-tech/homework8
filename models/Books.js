import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";


class Books extends Model {
    static async createDefaults() {
        const defaultBooks = [
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                description: "A story about the Jazz Age in the 1920s.",
                user_id: 1,
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                description: "A powerful novel about racism and injustice.",
                user_id: 2,
            },
            {
                title: "1984",
                author: "George Orwell",
                description: "A dystopian novel about surveillance and control.",
                user_id: 3,
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                description: "A romantic novel about manners and marriage.",
                user_id: 4,
            },
            {
                title: "Moby Dick",
                author: "Herman Melville",
                description: "A tale of obsession and the sea.",
                user_id: 5,
            },
            {
                title: "War and Peace",
                author: "Leo Tolstoy",
                description: "A massive novel about Russian society during the Napoleonic era.",
                user_id: 6,
            },
            {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                description: "A story of teenage rebellion and alienation.",
                user_id: 7,
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                description: "A fantasy adventure preceding Lord of the Rings.",
                user_id: 8,
            },
            {
                title: "Fahrenheit 451",
                author: "Ray Bradbury",
                description: "A dystopian novel about book burning and censorship.",
                user_id: 9,

            },
            {
                title: "Jane Eyre",
                author: "Charlotte Brontë",
                description: "A coming-of-age novel with gothic elements.",
                user_id: 10,
            },
        ];

        for (const book of defaultBooks) {
            await Books.findOrCreate({
                where: {title: book.title},
                defaults: book,
            });
        }
        return {};
    }
}

Books.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: db,
    modelName: 'Books',
    tableName: 'books',
    timestamps: true,
});


export default Books;