import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";

class Category extends Model {
    static async createDefaults() {
        const defaultCategories = []
        return {};
    }

}

Category.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
    }
}, {
    sequelize: db,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
});


export default Category;
