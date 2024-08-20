import mongoose from "mongoose";
import { Employee } from "../../types/EmployeeTypes";

const EmployeeSchema = new mongoose.Schema<Employee>(
  {
    image: {
      type: String,
      required: true,
    },
    jobTitleName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    salary: {
      type: Number,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    mails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mail", // Reference to the MailModel
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
