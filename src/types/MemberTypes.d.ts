import mongoose, { Document, Types } from "mongoose";
import { Article } from "./ArticlesTypes";
import { Dinosaur } from "./DinosaursTypes";

interface Member {
  academicTitle: "Prof" | "Dr" | "none";
  articles: (Document<unknown, {}, Article> &
    Article & {
      _id: Types.ObjectId;
    })[];
  dinosaurs: (Document<unknown, {}, Dinosaur> &
    Dinosaur & {
      _id: Types.ObjectId;
    })[];
  userId: string;
}

export { Member };
