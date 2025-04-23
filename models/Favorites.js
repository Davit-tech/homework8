import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";

import Users from "./Users.js";
import Books from "./Books.js";


class Favorites extends Model {


    static async createDefaults() {
        const defaultUsers = [
            {userName: "natash", email: "natash@gmail.com", password: "natash123"},
            {userName: "john", email: "john@example.com", password: "john123"},
            {userName: "jane", email: "jane@example.com", password: "jane123"},
            {userName: "alice", email: "alice@example.com", password: "alice123"},
            {userName: "bob", email: "bob@example.com", password: "bob123"},
            {userName: "charlie", email: "charlie@example.com", password: "charlie123"},
            {userName: "david", email: "david@example.com", password: "david123"},
            {userName: "emma", email: "emma@example.com", password: "emma123"},
            {userName: "frank", email: "frank@example.com", password: "frank123"},
            {userName: "grace", email: "grace@example.com", password: "grace123"},
        ];

        for (const user of defaultUsers) {
            await Users.findOrCreate({
                where: {email: user.email},
                defaults: user,
            });
        }
        return {}
    }
}

Favorites.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },


}, {
    sequelize: db,
    tableName: "favorites",
    modelName: "favorites",

});
Users.hasMany(Favorites, {foreignKey: "user_id", as: "favorites"});
Favorites.belongsTo(Users, {foreignKey: "user_id", as: "user"});

Favorites.belongsTo(Books, {foreignKey: "book_id", as: "book"});
Books.hasMany(Favorites, {foreignKey: "book_id", as: "favorites"});


export default Favorites;