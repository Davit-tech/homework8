import express from 'express';
import auth from "../middlewares/auth.js";

const router = express.Router();
import chatController from '../controllers/chatControllers.js';


router.get('/', chatController.getChatView)
router.get("/messages", auth, chatController.getMessages)
router.post("/send", auth, chatController.postMessages)
export default router;