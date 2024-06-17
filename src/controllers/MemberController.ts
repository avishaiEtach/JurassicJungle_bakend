import express from "express";
import { UserModel } from "../db/models/user";
import session from "express-session";
import { User } from "../types/UserTypes";
import { utilsFunctions } from "../utils/utilsFunctions";
import { MemberModel } from "../db/models/member";

class MemberController {
  updateMember = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { fieldsToChange } = req.body;
    try {
      const member = await MemberModel.findByIdAndUpdate(
        id,
        { $set: fieldsToChange }, // Use $set to update only the specified fields
        { new: true }
      );
      if (!member) {
        throw new Error(`Member with ID ${id} not found`);
      }
      const user = await UserModel.findById(member.userId);
      if (!user) {
        throw new Error(`User ${id} in member not found`);
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
      return res.status(200).json(member);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}

export default new MemberController();

// req.sessionStore.get(req.session.id, (err, sessionData) => {
//   if (err) {
//     console.log("err", err);
//     throw err;
//   }
//   console.log("sessionData", sessionData);
// });
