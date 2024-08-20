import express from "express";
import { auth } from "../middlewares/auth.middlewares";
import EmployeeController from "../controllers/EmployeeController";

const router = express.Router();

router.get("/getAllEmployees", auth, EmployeeController.getAllEmployees);
const EmployeeRouter = router;

export default EmployeeRouter;
