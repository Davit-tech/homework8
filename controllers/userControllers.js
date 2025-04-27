import {Books, Favorites, Reviews, Users} from "../models/index.js";
import helpers from "../utils/helpers.js";
import createError from "http-errors";
import {col, fn} from "sequelize";
import mail from "../services/mail.js";
import qs from "query-string";
import path from "path";

export default {
    // Get Views
    async getRegisterView(req, res) {
        res.render("users/register");
    },

    async getLoginView(req, res) {
        res.render('users/login');
    },

    async getProfileView(req, res) {
        res.render("users/userProfile");
    },

    async getUserUpdateView(req, res) {
        res.render("users/updateProfile", {});
    },

    async getFavoritesView(req, res) {
        const userId = req.userId;
        res.render("favorites/favorites", {userId});
    },

    async forgetPasswordView(req, res) {
        res.render("users/forgot-password");
    }, async resetPasswordView(req, res) {
        res.render("users/reset-password");
    },

    // User Registration and Activation
    async register(req, res) {
        const {userName, email, password} = req.body;

        try {
            const userEmail = await Users.findOne({where: {email}});

            if (userEmail) {
                return res.status(422).json({
                    success: false,
                    message: "User with this email already exists. Please try another one",
                    messageType: "error",
                });
            }

            const user = await Users.create({userName, email, password});
            const token = await helpers.createToken({userId: user.id});

            await mail(email, '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', "Profile activation email", "activate-user", {
                name: userName, link: `http://localhost:3000/user/activate?${qs.stringify({token})}`,
            }, [{
                filename: "book-covers.jpg", path: path.join(import.meta.dirname, "../public/uploads/book-covers.jpg")
            }]);

            user.activationToken = token;
            await user.save();

            res.status(201).json({
                user, success: true, message: "Registration successful!", messageType: "success",
            });

        } catch (err) {
            console.error("Error during user registration:", err);
            res.status(500).json({message: "Internal server error"});
        }
    }, async activate(req, res) {

        try {
            const {token} = req.query;

            const user = await Users.findOne({where: {activationToken: token}});

            if (!user) {
                return res.status(422).json({message: "Invalid activation token"});
            }

            user.status = "active";
            await user.save();
            res.render("userActive");
        } catch (err) {
            console.error("Error during activation:", err);
            res.status(500).json({message: "Activation failed"});
        }
    },

    // User Login
    async login(req, res, next) {

        try {
            const {email, password} = req.body;

            const user = await Users.findOne({where: {email}});

            if (!user) {
                return res.status(422).json({
                    success: false, message: "User not found", messageType: "error",
                });
            }

            if (user.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    message: "Account is not activated. Please check your email to activate your account.",
                    messageType: "error",
                });
            }

            const plainPassword = await user.dataValues.password;
            const isMatch = await Users.comparePassword(password, plainPassword);

            if (isMatch) {
                const token = await helpers.createToken(user.id);
                return res.status(200).json({
                    token, user, message: "Login successfully", success: true,
                });
            } else {
                return res.status(422).json({
                    success: false, messageType: "error", message: "Invalid password",
                });
            }

        } catch (err) {
            return next(createError(500, `Server error. Please try again later: ${err.message}`));
        }
    },

    // User Profile and Update
    async profile(req, res, next) {
        const id = req.userId;

        if (!id) {
            return next(createError(401, 'Authentication required'));
        }

        try {
            const user = await Users.findOne({where: {id}});

            if (!user) {
                return next(createError(404, "User not found"));
            }

            res.status(200).json({user});

        } catch (err) {
            return next(createError(500, `Server error. Please try again later: ${err.message}`));
        }
    },

    async updateUserProfile(req, res) {
        const id = req.userId;
        const {userName, email} = req.body;

        try {
            const user = await Users.findByPk(id);

            if (!user) {
                console.log("User not found");
                return res.status(404).json({message: "User not found"});
            }

            await Users.update({userName, email}, {where: {id}});

            res.json({message: "Profile updated successfully", success: true});

        } catch (error) {
            res.status(500).json({message: "Failed to update profile"});
        }
    },

    async deleteUser(req, res) {
        const id = req.userId;

        try {
            const result = await Users.destroy({where: {id}});

            if (!result) {
                return res.status(404).json({message: "User not found"});
            }

            res.status(200).json({message: "User deleted successfully"});

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Failed to delete user"});
        }
    },

    // Forgot Password and Reset
    async forgotPassword(req, res) {
        const {email} = req.body;

        try {
            const user = await Users.findOne({where: {email}});
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            const token = await helpers.createToken(user.id);

            await mail(email, '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', "Password Reset", "reset-password", {
                name: user.userName, email: user.email, link: `http://localhost:3000/user/resetPassword?token=${token}`,
            });

            res.json({message: "Password reset email sent."});

        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Error sending reset email."});
        }
    },

    async resetPassword(req, res) {


        const {newPassword, newPassword1, token} = req.body;
        console.log(newPassword1, newPassword);
        if (newPassword !== newPassword1) {
            return res.status(400).json({message: "Passwords do not match"});
        }
        try {
            const ifExist = helpers.verifyToken(token);
            const user = await Users.findByPk(ifExist.userId);
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            user.password = newPassword;
            await user.save();

            res.json({message: "Password has been updated."});

        } catch (err) {
            console.error(err);
            return res.status(500).json({message: "Failed to reset password"});
        }
    },

    // Favorites and Avatar
    async GetFavorites(req, res) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 3;
            const offset = (page - 1) * limit;

            if (!userId) {
                return res.status(400).json({error: "User ID is required"});
            }

            const favorites = await Favorites.findAll({
                limit, offset, where: {userId: userId}, include: [{
                    model: Books, as: "book", attributes: {
                        include: [[fn("ROUND", fn("AVG", col("book.reviews.rating")), 1), "avgRating"]],
                    }, include: [{model: Reviews, as: "reviews", attributes: []},],
                },], group: ["favorites.id", "book.id"], subQuery: false,
            });

            const totalFavorites = await Favorites.count({where: {userId: userId}});

            res.status(200).json({
                favorites, pagination: {
                    total: totalFavorites, page, totalPages: Math.ceil(totalFavorites / limit),
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Failed to fetch favorites"});
        }
    },

    async postAvatar(req, res) {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({message: "Unauthorized"});
            }

            const imgUrl = req.file;
            const avatarPath = imgUrl.path.replace("public/uploads", "");

            await Users.update({avatar: avatarPath}, {where: {id: userId}});

            res.status(201).json({
                message: "Avatar uploaded and saved to DB", avatar: avatarPath,
            });

        } catch (error) {
            res.status(500).json({message: "Error uploading avatar"});
        }
    },
};
