import express from "express";
import UsersController from "../controllers/UsersController";
import { auth } from "../middlewares/auth.middlewares";
import MemberController from "../controllers/MemberController";

const router = express.Router();
router.put("/updateMember/:id", auth, MemberController.updateMember);

const MembersRouter = router;

export default MembersRouter;
