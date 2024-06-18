import express from "express";
import DinosaursController from "../controllers/DinosaursController";
import { auth } from "../middlewares/auth.middlewares";

const router = express.Router();

router.get("/getDinosaurs/all", DinosaursController.getALLDinosaurs);
router.get("/getDinosaurs/:id", DinosaursController.getDinosaurById);
router.patch("/updateDinosaur/:id", DinosaursController.updateDinosaur);
router.post("/addDinosaur", DinosaursController.addDinosaur);
router.post("/searchDinosaurs", DinosaursController.searchDinosaurs);
router.post(
  "/uploadDinosaurImage",
  auth,
  DinosaursController.uploadDinosaurImage
);
router.delete("/deleteDinosaur/:id", DinosaursController.deleteDinosaur);

const DinosaursRouter = router;

export default DinosaursRouter;
