import Users from "./Users.js";
import Books from "./Books.js";
import Reviews from "./Reviews.js";


Users.hasMany(Books, {foreignKey: "user_id", as: "books"});
Books.belongsTo(Users, {foreignKey: "user_id", as: "user"});


Users.hasMany(Reviews, {foreignKey: "user_id", as: "reviews"});
Reviews.belongsTo(Users, {foreignKey: "user_id", as: "user"});


Books.hasMany(Reviews, {foreignKey: "book_id", as: "reviews"});
Reviews.belongsTo(Books, {foreignKey: "book_id", as: "book"});

export {
    Users,
    Books,
    Reviews,
};
