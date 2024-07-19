import express from "express";
import { UserModel } from "../db/models/user";
import session from "express-session";
import { User } from "../types/UserTypes";
import { utilsFunctions } from "../utils/utilsFunctions";
import { MemberModel } from "../db/models/member";
import mongoose from "mongoose";

class UsersController {
  getALLUsers = async (req: express.Request, res: express.Response) => {
    try {
      const users = await UserModel.find();
      for (let i = 0; i < users.length; i++) {
        if (users[i].memberId) {
          await users[i].populate("memberId");
        }
        if (users[i].memberId) {
          await users[i].populate("employeeId");
        }
      }
      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    try {
      const {
        body: { email, password },
      } = req;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new Error(`email not valid`);
      }
      const encryptedPassword = utilsFunctions.hashStringWithKey(password);
      if (encryptedPassword !== user.password) {
        throw new Error(`password not valid`);
      }
      await user.populate("favArticles");
      if (user.memberId) {
        await user.populate("memberId");
        await user.populate({
          path: "memberId.dinosaurs",
          model: "Dinosaur",
        });
        await user.populate({
          path: "memberId.articles",
          model: "Article",
        });
      }
      if (user.memberId.articles) {
        for (let index = 0; index < user.memberId.articles.length; index++) {
          await user.memberId.articles[index].populate({
            path: "author",
            model: "Member",
          });
          await user.memberId.articles[index].populate({
            path: "author.userId",
            model: "User",
          });
          user.memberId.articles[index].author = `${
            user.memberId.articles[index].author.academicTitle !== "none"
              ? user.memberId.articles[index].author.academicTitle + "."
              : ""
          }${user.memberId.articles[index].author.userId.firstname} ${
            user.memberId.articles[index].author.userId.lastname
          }`;
        }
      }
      const userToRes = user.toJSON();
      delete userToRes.password;
      req.session.user = userToRes;
      return res.status(200).json(userToRes);
    } catch (err: any) {
      return res.status(401).send(err.message);
    }
  };

  signup = async (req: express.Request, res: express.Response) => {
    try {
      const { user } = req.body;
      delete user._id;
      const checkValues = utilsFunctions.checkForEmptyValues(user);
      if (!checkValues.isValid) {
        throw new Error(`The ${checkValues.key} is empty`);
      }
      if (!user.email.includes("@")) {
        throw new Error(`email must conation @`);
      }
      const encryptedPassword = utilsFunctions.hashStringWithKey(user.password);
      user.password = encryptedPassword;
      user.permissions = 1;
      user.favArticles = [];
      const newUser = new UserModel(user);
      const findUser = await UserModel.find({ email: newUser.email });
      if (findUser.length) {
        throw new Error(`The user ${newUser.email} all ready in the system`);
      }
      const savedUser = await newUser.save();
      const userToRes = savedUser.toJSON();
      delete userToRes.password;
      req.session.user = userToRes;
      return res.status(200).json(userToRes);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  getLoggedInUser = async (req: express.Request, res: express.Response) => {
    try {
      return res.status(200).json(req.session.user);
    } catch (err: any) {
      return res.status(401).send(err.message);
    }
  };

  logout = async (req: express.Request, res: express.Response) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send("Failed to destroy session");
        }
      });
      return res.status(200).send();
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  updateUser = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { fieldsToChange } = req.body;
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { $set: fieldsToChange }, // Use $set to update only the specified fields
        { new: true }
      );
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      await user.populate("favArticles");
      if (user.memberId) {
        await user.populate("memberId");
        await user.populate({
          path: "memberId.dinosaurs",
          model: "Dinosaur",
        });
      }
      const userToRes = user.toJSON();
      delete userToRes.password;
      req.session.user = userToRes;
      return res.status(200).json(userToRes);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const user = await UserModel.findById(id).deleteOne();
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return res.status(200).send();
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  deleteManyUser = async (req: express.Request, res: express.Response) => {
    const { idsToDelete } = req.body;
    try {
      const objectIds = idsToDelete.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );
      const result = await UserModel.deleteMany({ _id: { $in: objectIds } });
      return res.status(200).send();
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}

export default new UsersController();

// req.sessionStore.get(req.session.id, (err, sessionData) => {
//   if (err) {
//     console.log("err", err);
//     throw err;
//   }
//   console.log("sessionData", sessionData);
// });
