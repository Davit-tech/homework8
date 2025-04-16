import {Books, Reviews, Users} from "../models/index.js";
import helpers from "../utils/helpers.js";
import createError from "http-errors";

export default {
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
        res.render("users/updateProfile", {})
    },
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
            await Users.createDefaults()
            await Books.createDefaults()
            await Reviews.createDefaults()

            const user = await Users.create({
                userName,
                email,
                password
            });
            res.status(201).json({
                user,
                success: true,
                message: "Registration successful!",
                messageType: "success",
            });
        } catch (err) {
            console.log(err);
        }
    },
    async login(req, res, next) {
        const {email, password} = req.body;
        try {
            const user = await Users.findOne({where: {email}});
            if (!user) {
                return res.status(422).json({
                    success: false,
                    message: "User not found",
                    messageType: "error",
                });
            }
            const userId = user.id;
            const plainPassword = await user.dataValues.password;
            const isMatch = await Users.comparePassword(password, plainPassword);
            if (isMatch) {
                const token = await helpers.createToken(userId);
                return res.status(200).json({
                    token,
                    user,
                    message: "Login successfully",
                    success: true,
                });
            } else {
                return res.status(422).json({
                    success: false,
                    messageType: "error",
                    message: "invalid password",
                });
            }


        } catch (err) {
            return next(createError(500, `Server error. Please try again later: ${err.message}`));
        }
    },
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
            res.status(200).json({
                user
            });
        } catch (err) {
            return next(createError(500, `Server error. Please try again later: ${err.message}`));
        }
    },
    async updateUserProfile(req, res) {
        const id = req.userId;
        const {userName, email} = req.body;

        try {

            const user = await Users.findByPk(id);
            console.log(user);
            if (!user) {
                console.log("user not found");
                return res.status(404).json({message: "user not found"});
            }

            await Users.update({userName, email}, {where: {id}});

            res.json({
                message: "Profile updated successfully",
            });
        } catch (error) {
            console.log(error);
        }
    },
    async deleteUser(req, res) {
        const id = req.userId;

        try {

            const result = await Users.destroy({where: {id}});
            if (!result) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            res.status(200).json({
                message: "User deleted successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to delete user",
            });
        }
    },
};