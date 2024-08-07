import mongoose from "mongoose";
import { User } from "../../types/UserTypes";

const UserSchema = new mongoose.Schema<User>(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: false,
    },
    dob: {
      type: Date,
      require: true,
    },
    permissions: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    favArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article", // Reference to the ArticleModel
      },
    ],
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Reference to the MemberModel
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Reference to the EmployeeModel
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
