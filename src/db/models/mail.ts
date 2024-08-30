import mongoose from "mongoose";
import { Mail } from "../../types/MailTypes";

const MailSchema = new mongoose.Schema<Mail>(
  {
    subject: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    sendTime: {
      type: Date,
      require: true,
    },
    fromSend: {
      type: String,
      require: true,
    },
    read: {
      type: Boolean,
      require: true,
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

export const MailModel = mongoose.model("Mail", MailSchema);
