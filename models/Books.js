import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";


class Books extends Model {
    static async createDefaults() {
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