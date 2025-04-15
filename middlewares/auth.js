import helpers from "../utils/helpers.js";
import createError from "http-errors";

export default async (req, res, next) => {
    let token = req.headers.authorization || null;
    if (!token) {
        res.status(401).json({
            message: "token not found",
        });
        return;
    }
    token = token.replace("Bearer ", "");

    try {
        const decoded = await helpers.verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.log(err);
        return next(createError(401, "Invalid or expired token"));
    }
};
