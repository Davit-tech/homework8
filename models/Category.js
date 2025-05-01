import { DataTypes, Model } from 'sequelize';
import db from "../clients/db.mysql.js";

class Category extends Model {
    static async createDefaults() {
        const defaultCategories = [
            { name: "Fiction" },
            { name: "Non-fiction" },
            { name: "Fantasy" },
            { name: "Science Fiction" },
            { name: "Romance" },
            { name: "Thriller" },
            { name: "Biography" },
            { name: "Self-Help" },
            { name: "Children's Books" },
            { name: "Young Adult" },
            { name: "Comics / Manga" }
        ];

        for (const category of defaultCategories) {
            await Category.findOrCreate({
                where: { name: category.name },
                defaults: category,
            });
        }
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

    }
}, {
    sequelize: db,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    indexes: [
        {fields: ["name"], unique: true},
    ]
});

export default Category;
