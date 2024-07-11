import mongoose from "mongoose";
import { Article } from "../../types/ArticlesTypes";

const ArticleSchema = new mongoose.Schema<Article>(
  {
    title: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    topic: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    images: {
      type: [String],
      require: true,
    },
    favoriteGrade: {
      type: Number,
      require: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    keyWords: {
      type: [String],
      required: true,
    },
    articleMainImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ArticleModel = mongoose.model("Article", ArticleSchema);
