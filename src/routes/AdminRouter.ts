import express from "express";
import { auth } from "../middlewares/auth.middlewares";
import AdminController from "../controllers/AdminController";

const router = express.Router();

router.put("/updateUserByAdmin/:id", auth, AdminController.updateUserByAdmin);
router.post("/createUserByAdmin", auth, AdminController.createUserByAdmin);
router.get("/getUsersByRole", auth, AdminController.getUsersByRole);
router.get(
  "/getDinosaursVsArticles",
  auth,
  AdminController.getDinosaursVsArticles
);
router.get("/getIncomeExpenses", auth, AdminController.getIncomeExpenses);

const AdminRouter = router;

export default AdminRouter;
