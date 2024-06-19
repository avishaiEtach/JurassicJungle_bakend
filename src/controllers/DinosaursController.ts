import express, { response } from "express";
import { DinosaurModel } from "../db/models/dinosaur";
import { utilsFunctions } from "../utils/utilsFunctions";
import { Dinosaur } from "../types/DinosaursTypes";
import { UploadApiOptions, v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { InvalidatedProjectKind } from "typescript";

class DinosaursController {
  getALLDinosaurs = async (req: express.Request, res: express.Response) => {
    const { page, limit } = req.query;
    try {
      const dinosaurs = await DinosaurModel.find();
      const paginationDinosaurs = utilsFunctions.getPagination(
        page,
        limit,
        dinosaurs
      );
      return res.status(200).json(paginationDinosaurs);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
  getDinosaurById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const dinosaur = await DinosaurModel.findById(id);
      if (!dinosaur) {
        throw new Error(`Dinosaur with ID ${id} not found`);
      }
      return res.status(200).json(dinosaur);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
  updateDinosaur = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { fieldsToChange } = req.body;
    try {
      const dinosaur = await DinosaurModel.findByIdAndUpdate(
        id,
        { $set: fieldsToChange }, // Use $set to update only the specified fields
        { new: true }
      );
      if (!dinosaur) {
        throw new Error(`Dinosaur with ID ${id} not found`);
      }
      return res.status(200).json(dinosaur);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
  addDinosaur = async (req: express.Request, res: express.Response) => {
    const { dinosaur } = req.body;
    try {
      const newDinosaur = new DinosaurModel(dinosaur);
      const findDinosaur = await DinosaurModel.find({ name: newDinosaur.name });
      if (findDinosaur.length) {
        throw new Error(
          `The dinosaur ${newDinosaur.name} all ready in the system`
        );
      }
      const savedDinosaur = await newDinosaur.save();
      return res.status(200).json(savedDinosaur);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  deleteDinosaur = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const dinosaur = await DinosaurModel.findById(id).deleteOne();
      if (!dinosaur) {
        throw new Error(`Dinosaur with ID ${id} not found`);
      }
      return res.status(200);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  searchDinosaurs = async (req: express.Request, res: express.Response) => {
    const { searchParameters } = req.body;
    const { page, limit } = req.query;
    let dinosaurs: Dinosaur[] = [];
    const query: any = {};
    try {
      for (const param of searchParameters) {
        if (param.name) {
          query.name = new RegExp(param.name, "i");
        }
        if (param.continent) {
          query.continent = param.continent;
        }
        if (param.diet) {
          query.diet = param.diet;
        }
        if (param.size) {
          if (param.size === "small") {
            query.bodyLength = { $lte: 5 };
          } else if (param.size === "medium") {
            query.bodyLength = { $gte: 5, $lte: 15 };
          } else if (param.size === "large") {
            query.bodyLength = { $gte: 15 };
          }
        }
        if (param.weight) {
          if (param.weight === "light") {
            query.weight = { $lte: 1000 };
          } else if (param.weight === "medium") {
            query.weight = { $gte: 1000, $lte: 10000 };
          } else if (param.weight === "heavy") {
            query.weight = { $gte: 10000 };
          }
        }
      }
      dinosaurs = await DinosaurModel.find(
        searchParameters.length > 0 ? query : {}
      );
      // for (const value of searchParameters) {
      //   const valueKeys = Object.keys(value);
      //   if (valueKeys.includes("name")) {
      //     dinosaurs =
      //       dinosaurs.length > 0 ? dinosaurs : await DinosaurModel.find();
      //     dinosaurs = dinosaurs.filter((dinosaur) =>
      //       dinosaur.name
      //         .toLocaleLowerCase()
      //         .includes(value.name.toLocaleLowerCase())
      //     );
      //   } else if (valueKeys.includes("continent")) {
      //     const newDinosaurs =
      //       dinosaurs.length > 0
      //         ? dinosaurs.filter(
      //             (dinosaur) => dinosaur.continent === value.continent
      //           )
      //         : await DinosaurModel.find({
      //             continent: value.continent,
      //           });
      //     dinosaurs = newDinosaurs;
      //   } else if (valueKeys.includes("diet")) {
      //     const newDinosaurs =
      //       dinosaurs.length > 0
      //         ? dinosaurs.filter((dinosaur) => dinosaur.diet === value.diet)
      //         : await DinosaurModel.find({
      //             diet: value.diet,
      //           });
      //     dinosaurs = newDinosaurs;
      //   } else if (valueKeys.includes("size")) {
      //     dinosaurs =
      //       dinosaurs.length > 0 ? dinosaurs : await DinosaurModel.find();
      //     if (value.size === "small") {
      //       dinosaurs = dinosaurs.filter(
      //         (dinosaur) => dinosaur.bodyLength <= 5
      //       );
      //     } else if (value.size === "medium") {
      //       dinosaurs = dinosaurs.filter(
      //         (dinosaur) =>
      //           dinosaur.bodyLength >= 5 && dinosaur.bodyLength <= 15
      //       );
      //     } else if (value.size === "large") {
      //       dinosaurs = dinosaurs.filter(
      //         (dinosaur) => dinosaur.bodyLength >= 15
      //       );
      //     }
      //   } else if (valueKeys.includes("weight")) {
      //     dinosaurs =
      //       dinosaurs.length > 0 ? dinosaurs : await DinosaurModel.find();

      //     if (value.weight === "light") {
      //       dinosaurs = dinosaurs.filter(
      //         (dinosaur) => dinosaur.weight / 1000 <= 1
      //       );
      //     } else if (value.weight === "medium") {
      //       console.log("hi2");
      //       dinosaurs = dinosaurs.filter(
      //         (dinosaur) =>
      //           dinosaur.weight / 1000 >= 1 && dinosaur.weight / 1000 <= 10
      //       );
      //     } else if (value.weight === "heavy") {
      //       dinosaurs = dinosaurs.filter(
      //         (dinosaur) => dinosaur.weight / 1000 >= 10
      //       );
      //     }
      //   }
      // }
      const paginationDinosaurs = utilsFunctions.getPagination(
        page,
        limit,
        dinosaurs
      );
      return res.status(200).json(paginationDinosaurs);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  uploadDinosaurImage = async (req: express.Request, res: express.Response) => {
    cloudinary.config({
      cloud_name: "maindevcloud",
      api_key: "532634431324769",
      api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
    });

    const opts: UploadApiOptions = {
      overwrite: true,
      invalidate: true,
      resource_type: "auto",
      upload_preset: "JurassicJungle",
    };

    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.body.image,
        opts
      );
      return res.status(200).json(uploadResult?.secure_url ?? "");
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}

export default new DinosaursController();
