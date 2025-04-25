import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";
import Books from './Books.js';
import Category from './Category.js';


class BookCategory extends Model {
    static async createDefaults() {
        return {}
    }
}

BookCategory.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },


}, {
    sequelize: db,
    modelName: 'BookCategory',
    tableName: 'book_categories',
    timestamps: true,
});

Category.belongsToMany(Books, {
    through: BookCategory,
    foreignKey: 'category_id',
    otherKey: 'bookId',
    as: 'books'
});


export default BookCategory;
