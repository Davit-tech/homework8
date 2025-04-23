import express from 'express';
import schemas from "../schemas/users.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
import userController from '../controllers/userControllers.js';
import fileUpload from "../middlewares/fileUpload.js";

//Views
router.get("/login", userController.getLoginView);
router.get("/register", userController.getRegisterView);
router.get("/profile", userController.getProfileView);
router.get("/profile/update", userController.getUserUpdateView);
router.get("/forgetPassword", userController.forgetPasswordView)

// API
router.get("/profile/data", auth, userController.profile);
router.post("/register", validate(schemas.register, "body"), userController.register);
router.post("/login", validate(schemas.login, "body"), userController.login);
router.put("/profile", auth, validate(schemas.login, "body"), userController.updateUserProfile);
router.delete("/profile", auth, userController.deleteUser);
router.get("/:userId/favorites/", userController.getFavoritesView)

router.get("/:userId/favorites/data", auth, userController.GetFavorites)
router.post("/upload-avatar", auth, fileUpload.single("avatar"), userController.postAvatar);

router.get("/activate", validate(schemas.activate, "query"), userController.activate);

router.post("/forgot-password", auth, validate(schemas.forgotPassword, "body"), userController.forgotPassword);

router.post("/reset-password", auth, validate(schemas.resetPassword, "body"), userController.resetPassword);

export default router;

