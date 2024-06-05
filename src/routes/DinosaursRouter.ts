import express from "express";
import DinosaursController from "../controllers/DinosaursController";
const { auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

router.get("/getDinosaurs/all", DinosaursController.getALLDinosaurs);
router.get("/getDinosaurs/:id", DinosaursController.getDinosaurById);
router.post("/searchDinosaurs", DinosaursController.searchDinosaurs);
router.patch("/updateDinosaur/:id", DinosaursController.updateDinosaur);
router.post("/addDinosaur", DinosaursController.addDinosaur);
router.delete("/deleteDinosaur/:id", DinosaursController.deleteDinosaur);

const DinosaursRouter = router;

export default DinosaursRouter;
