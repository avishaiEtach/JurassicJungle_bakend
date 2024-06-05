import mongoose from "mongoose";
import { Dinosaur } from "../../types/DinosaursTypes";

const DinosaurSchema = new mongoose.Schema<Dinosaur>(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    continent: {
      type: String,
      enum: ["NA", "AF", "EU", "AS", "SA"],
      require: true,
    },
    diet: {
      type: String,
      enum: ["Carnivore", "Piscivore", "Herbivore"],
      require: true,
    },
    family: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    weight: {
      type: Number,
      require: true,
    },
    time_on_earth: {
      type: String,
      require: true,
    },
    period: {
      type: String,
      require: true,
    },
    mainArticle: {
      type: String,
      require: true,
    },
    bodyLength: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DinosaurModel = mongoose.model("Dinosaur", DinosaurSchema);
