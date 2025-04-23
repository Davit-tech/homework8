import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";
import Users from "./Users.js";
import Books from "./Books.js";
import Reviews from "./Reviews.js";

class Comments extends Model {
    static async createDefaults() {
        const defaultComments = [];
        for (let reviewId = 1; reviewId <= 10; reviewId++) {
            defaultComments.push(
                {
                    comments: `Great insights on review !`,
                    user_id: ((reviewId + 1) % 10) + 1,
                    review_id: reviewId,
                },
                {
                    comments: `I had a similar opinion about this book ).`,
                    user_id: ((reviewId + 2) % 10) + 1,
                    review_id: reviewId,
                },
                {
                    comments: `Thanks for sharing your thoughts on review .`,
                    user_id: ((reviewId + 3) % 10) + 1,
                    review_id: reviewId,
                }
            );
        }
        for (const comment of defaultComments) {
            await Comments.findOrCreate({
                where: {
                    user_id: comment.user_id,
                    review_id: comment.review_id,
                    comments: comment.comments
                },
                defaults: comment
            });
        }
        return {};
    }
}

Comments.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: 'comments',
    tableName: 'comments',
    timestamps: true,
});
Users.hasMany(Comments, {foreignKey: "user_id", as: "comments"});
Comments.belongsTo(Users, {foreignKey: "user_id", as: "user"});
Reviews.hasMany(Comments, {foreignKey: "review_id", as: "comments"});
Comments.belongsTo(Reviews, {foreignKey: "review_id", as: "review"});

export default Comments;
