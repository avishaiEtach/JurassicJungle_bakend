import express from "express";
import ArticlesController from "../controllers/ArticlesController";
import { auth } from "../middlewares/auth.middlewares";

const router = express.Router();

router.get("/getArticles/all", ArticlesController.getALLArticles);
router.get("/getBestArticles", ArticlesController.getBestArticles);
router.get("/getArticles/:id", ArticlesController.getLArticleById);
router.get("/getKeyWords", ArticlesController.getKeyWords);
router.post("/searchArticles", ArticlesController.searchArticles);
router.post("/uploadArticleImage", auth, ArticlesController.uploadArticleImage);
router.post("/addArticle", ArticlesController.addArticle);
router.put("/updateArticle/:id", ArticlesController.updateArticle);

const ArticlesRouter = router;

export default ArticlesRouter;
