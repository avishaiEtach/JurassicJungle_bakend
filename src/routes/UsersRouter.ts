import express from "express";
import UsersController from "../controllers/UsersController";
import { auth } from "../middlewares/auth.middlewares";

const router = express.Router();

router.get("/getUsers/all", auth, UsersController.getALLUsers);
router.get("/getLoggedInUser", auth, UsersController.getLoggedInUser);
router.get("/logout", UsersController.logout);
router.post("/login", UsersController.login);
router.post("/signup", UsersController.signup);
router.put("/updateDinosaur/:id", UsersController.updateUser);

const UsersRouter = router;

export default UsersRouter;
