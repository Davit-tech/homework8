import {Router} from "express";
import {Op} from "sequelize";

import socket from "../services/socket.js";

import Messages from "../models/Messages.js";

export default {
    async getChatView(req, res) {
        res.render('chat');
    },
    async getMessages(req, res, next) {
        try {
            const {to} = req.query;

            console.log(+to, +req.userId)

            res.json({
                messages: await Messages.findAll({
                    where: {
                        [Op.or]: [
                            {from: +req.userId, to: +to},
                            {
                                from: +to, to: +req.userId,
                            }
                        ]
                    }
                })
            });
        } catch (e) {
            console.log(e.message);
            next(e);
        }
    },
    async postMessages(req, res, next) {
        try {
            const {message, to,} = req.body;
            console.log(to)
            console.log(message)
            console.log(req.body);

            await Messages.create({
                from: +req.userId,
                to: +to,
                message
            })

            socket.emit(`user_${to}`, {
                from: +req.userId,
                to: +to,
                message
            });

            res.status(201).json({message: "Message sent successfully"});
        } catch (e) {
            next(e);
        }
    }

}




