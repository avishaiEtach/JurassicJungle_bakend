import mongoose from "mongoose";
import { Member } from "../../types/MemberTypes";

const MemberSchema = new mongoose.Schema<Member>(
  {
    academicTitle: {
      type: String,
      enum: ["Prof", "Dr", "none"],
      require: true,
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article", // Reference to the ArticleModel
      },
    ],
    dinosaurs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dinosaur", // Reference to the ArticleModel
      },
    ],
    userId: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MemberModel = mongoose.model("Member", MemberSchema);
