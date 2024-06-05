import express from "express";
import ArticlesController from "../controllers/ArticlesController";

const router = express.Router();

router.get("/getArticles/all", ArticlesController.getALLArticles);
router.get("/getBestArticles", ArticlesController.getBestArticles);
router.get("/getArticles/:id", ArticlesController.getLArticleById);
router.get("/getKeyWords", ArticlesController.getKeyWords);
router.post("/searchArticles", ArticlesController.searchArticles);

const ArticlesRouter = router;

export default ArticlesRouter;
