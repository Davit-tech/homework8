import Users from "./Users.js";
import Books from "./Books.js";
import Reviews from "./Reviews.js";


try {
    Users.hasMany(Books, {foreignKey: "user_id", as: "books"});
    Books.belongsTo(Users, {foreignKey: "user_id", as: "user"});
    console.log(" Users <-> Books association OK");
} catch (error) {
    console.error(" Error in Users <-> Books association:", error);
}

try {
    Users.hasMany(Reviews, {foreignKey: "user_id", as: "reviews"});
    Reviews.belongsTo(Users, {foreignKey: "user_id", as: "user"});
    console.log(" Users <-> Reviews association OK");
} catch (error) {
    console.error(" Error in Users <-> Reviews association:", error);
}

try {
    Books.hasMany(Reviews, {foreignKey: "book_id", as: "reviews"});
    Reviews.belongsTo(Books, {foreignKey: "book_id", as: "book"});
    console.log(" Books <-> Reviews association OK");
} catch (error) {
    console.error(" Error in Books <-> Reviews association:", error);
}

export {
    Users,
    Books,
    Reviews,
};
