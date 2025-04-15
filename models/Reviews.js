import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";


class Reviews extends Model {
    static async createDefaults() {
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
