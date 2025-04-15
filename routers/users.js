import express from 'express';
import schemas from "../schemas/users.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
import userController from '../controllers/userControllers.js';
//Views
router.get("/login", userController.getLoginView);
router.get("/register", userController.getRegisterView);
router.get("/profile", userController.getProfileView);
router.get("/profile/update", userController.getUserUpdateView);

// API
router.get("/profile/data", auth, userController.profile);
router.post("/register", validate(schemas.register, "body"), userController.register);
router.post("/login", validate(schemas.login, "body"), userController.login);
router.put("/profile", auth, validate(schemas.login, "body"), userController.updateUserProfile);
router.delete("/profile", auth, userController.deleteUser);


export default router;

