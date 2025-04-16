import {DataTypes, Model} from 'sequelize';
import db from "../clients/db.mysql.js";
import bcrypt from "bcrypt";


class Users extends Model {
    static async passwordHash(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }


    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

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

Users.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            const saltRounds = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, saltRounds);
            this.setDataValue("password", hash);
        },
        get() {
            return undefined;
        }
    },
}, {
    sequelize: db,
    tableName: "users",
    modelName: "users",
    indexes: [
        {fields: ["email"], unique: true},
    ]
});


export default Users;