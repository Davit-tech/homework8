import {Sequelize} from "sequelize";
import {createConnection} from "mysql2/promise";

const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env;

async function databaseExists() {
    try {
        const connection = await createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\``);
        console.log(`Database ${DB_DATABASE} is ready.`);
        await connection.end();
        return true;
    } catch (error) {
        console.error("Error creating database:", error);
        return false;
    }
}

const CONFIGS = {
    host: DB_HOST,
    dialect: "mysql",
    define: {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
    },
    logging: false,
};

async function initDatabase() {
    const isReady = await databaseExists();
    if (!isReady) {
        console.error("Database setup failed.");
        process.exit(1);
    }

    const MYSQL = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, CONFIGS);

    try {
        await MYSQL.authenticate();
        console.log("Database connection successfully.");
        return MYSQL;
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

const MYSQL = await initDatabase();

export default MYSQL;
