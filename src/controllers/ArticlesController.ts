import express from "express";
import { ArticleModel } from "../db/models/article";
import { Article } from "../types/ArticlesTypes";
import { utilsFunctions } from "../utils/utilsFunctions";
import mongoose from "mongoose";

class ArticlesController {
  getALLArticles = async (req: express.Request, res: express.Response) => {
    try {
      const articles = await ArticleModel.find();
      // const paginationDinosaurs = utilsFunctions.getPagination(
      //   page,
      //   limit,
      //   dinosaurs
      // );
      return res.status(200).json(articles);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  getBestArticles = async (req: express.Request, res: express.Response) => {
    try {
      const articles = await ArticleModel.find({
        favoriteGrade: { $gte: 8 },
      }).limit(6);
      return res.status(200).json(articles);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  getLArticleById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`ID ${id} not valid`);
      }
      const article = await ArticleModel.findById(id);
      if (!article) {
        throw new Error(`Article with ID ${id} not found`);
      }
      return res.status(200).json(article);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  getKeyWords = async (req: express.Request, res: express.Response) => {
    try {
      // const articles: Article[] = await ArticleModel.find();
      // let keywords = articles.reduce((acc: string[], article) => {
      //   acc.push(...article.keyWords);
      //   return acc;
      // }, []);
      // keywords = keywords.sort((a, b) => {
      //   const countA = keywords.filter((word) => word === a).length;
      //   const countB = keywords.filter((word) => word === b).length;
      //   if (countA === countB) {
      //     return a.localeCompare(b);
      //   }
      //   return countB - countA;
      // });

      // const wordMap = new Map<string, number>();
      // keywords.forEach((word) => {
      //   if (wordMap.has(word)) {
      //     wordMap.set(word, wordMap.get(word)! + 1);
      //   } else {
      //     wordMap.set(word, 1);
      //   }
      // });

      // let sortedWords = Array.from(wordMap.entries())
      //   .sort((a, b) => b[1] - a[1])
      //   .map(([word]) => word);

      // sortedWords = sortedWords.slice(0, 5);

      const sortedWords = await ArticleModel.aggregate([
        { $unwind: "$keyWords" }, // Unwind the keyWords array
        { $group: { _id: "$keyWords", count: { $sum: 1 } } }, // Group by keyword and count occurrences
        { $sort: { count: -1, _id: 1 } }, // Sort by count descending, then alphabetically
        { $limit: 5 }, // Limit to top 5 words
      ]);
      // Extract just the word from each result
      const topWords = sortedWords.map((wordObj) => wordObj._id);
      topWords.unshift("all");
      return res.status(200).json(topWords);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  searchArticles = async (req: express.Request, res: express.Response) => {
    const { searchParameters } = req.body;
    const { page, limit } = req.query;
    let articles: Article[] = await ArticleModel.find();
    const query: any = {};
    try {
      // for (const value of searchParameters) {
      //   const valueKeys = Object.keys(value);
      //   if (valueKeys.includes("name")) {
      //     articles = articles.filter(
      //       (article) =>
      //         article.content
      //           .toLocaleLowerCase()
      //           .includes(value.name.toLocaleLowerCase()) ||
      //         article.title
      //           .toLocaleLowerCase()
      //           .includes(value.name.toLocaleLowerCase())
      //     );
      //   }
      //   if (valueKeys.includes("keyword")) {
      //     articles = articles.filter((article) =>
      //       article.keyWords.includes(value.keyword)
      //     );
      //   }
      // }
      for (const param of searchParameters) {
        if (param.name) {
          const nameRegExp = new RegExp(param.name, "i"); // Case-insensitive regex for partial match
          query.$or = [
            { title: { $regex: nameRegExp } },
            { content: { $regex: nameRegExp } },
          ];
        }
        if (param.keyword) {
          query.keyWords = param.keyword;
        }
      }

      articles = await ArticleModel.find(
        searchParameters.length > 0 ? query : {}
      );

      const paginationDinosaurs = utilsFunctions.getPagination(
        page,
        limit,
        articles
      );
      return res.status(200).json(paginationDinosaurs);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}

export default new ArticlesController();
