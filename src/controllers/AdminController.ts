import express from "express";
import session from "express-session";
import { utilsFunctions } from "../utils/utilsFunctions";
import mongoose from "mongoose";
import { UserModel } from "../db/models/user";
import { MemberModel } from "../db/models/member";
import { EmployeeModel } from "../db/models/employee";
import { ArticleModel } from "../db/models/article";
import { DinosaurModel } from "../db/models/dinosaur";
import { MailModel } from "../db/models/mail";
import { Mail } from "../types/MailTypes";

class AdminController {
  getUsersByRole = async (req: express.Request, res: express.Response) => {
    let users = await UserModel.find({});
    const usersByRole = users.reduce(
      (acc: { asset: string; amount: number }[], user) => {
        if (user.permissions) {
          if (!acc[user.permissions - 1]) {
            acc[user.permissions - 1] = {
              asset:
                user.permissions === 4
                  ? "admins"
                  : user.permissions === 3
                  ? "employees"
                  : user.permissions === 2
                  ? "members"
                  : "users",
              amount: 1,
            };
          } else {
            acc[user.permissions - 1].amount++;
          }
        }
        return acc;
      },
      []
    );
    return res.status(200).json(usersByRole);
  };

  getDinosaursVsArticles = async (
    req: express.Request,
    res: express.Response
  ) => {
    let dinosaursNumber = (await DinosaurModel.find({})).length;
    let articlesNumber = (await ArticleModel.find({})).length;
    return res.status(200).json([
      { asset: "dinosaurs", amount: dinosaursNumber },
      { asset: "articles", amount: articlesNumber },
    ]);
  };

  getIncomeExpenses = async (req: express.Request, res: express.Response) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const incomeExpenses = months.map((month) => {
      return {
        month,
        income: utilsFunctions.getRandomIntInclusive(5000, 15000),
        expenses: utilsFunctions.getRandomIntInclusive(5000, 15000),
      };
    });

    return res.status(200).json(incomeExpenses);
  };

  updateUserByAdmin = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { user, member, employee, ids } = req.body;
    try {
      let userToUpdate = await UserModel.findById(id);
      if (!userToUpdate) {
        throw new Error(`User with ID ${id} not found`);
      }
      Object.assign(userToUpdate, user);

      if (Object.keys(member).length) {
        let memberToUpdate = await MemberModel.findById(ids.memberId as string);
        if (!memberToUpdate) {
          const newMember = new MemberModel(member);
          newMember.userId = id;
          (newMember.dinosaurs = []), (newMember.articles = []);
          const savedMember = await newMember.save();
          userToUpdate.memberId = new mongoose.Types.ObjectId(
            savedMember._id
          ) as any;
        } else {
          Object.assign(memberToUpdate, member);
          await memberToUpdate.save();
        }
      }

      if (Object.keys(employee).length) {
        let employeeToUpdate = await EmployeeModel.findById(
          ids.employeeId as string
        );
        if (!employeeToUpdate) {
          const newEmployee = new EmployeeModel(employee);
          newEmployee.userId = id;
          const savedEmployee = await newEmployee.save();
          userToUpdate.employeeId = new mongoose.Types.ObjectId(
            savedEmployee._id
          ) as any;
        } else {
          Object.assign(employeeToUpdate, employee);
          await employeeToUpdate.save();
        }
      }

      if (user.permissions === 2) {
        let employee = await EmployeeModel.findById(userToUpdate.employeeId);
        if (employee) {
          await employee.deleteOne();
        }
        await userToUpdate.updateOne({
          $unset: { employeeId: "" },
        });
      }

      if (user.permissions === 1) {
        let employee = await EmployeeModel.findById(userToUpdate.employeeId);
        let member = await MemberModel.findById(userToUpdate.memberId);
        if (employee) {
          await employee.deleteOne();
        }
        if (member) {
          await member.deleteOne();
        }
        await userToUpdate.updateOne({
          $unset: { employeeId: "", memberId: "" },
        });
      }

      const savedUser = await userToUpdate.save();
      const userToRes = savedUser.toObject();
      delete userToRes.password;
      return res.status(200).json(userToRes);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  createUserByAdmin = async (req: express.Request, res: express.Response) => {
    const { user, member, employee, ids } = req.body;
    try {
      const newUser = new UserModel(user);
      newUser.favArticles = [];
      const encryptedPassword = utilsFunctions.hashStringWithKey(
        process.env.DEFAULT_ADMIN_PASSWORD as string
      );
      newUser.password = encryptedPassword;
      if (Object.keys(member).length) {
        let memberToUpdate = await MemberModel.findById(ids.memberId as string);
        if (!memberToUpdate) {
          const newMember = new MemberModel(member);
          newMember.userId = newUser._id.toString();
          (newMember.dinosaurs = []), (newMember.articles = []);
          const savedMember = await newMember.save();
          newUser.memberId = new mongoose.Types.ObjectId(
            savedMember._id
          ) as any;
        } else {
          Object.assign(memberToUpdate, member);
          await memberToUpdate.save();
        }
      }

      if (Object.keys(employee).length) {
        let employeeToUpdate = await EmployeeModel.findById(
          ids.employeeId as string
        );
        if (!employeeToUpdate) {
          const newEmployee = new EmployeeModel(employee);
          newEmployee.userId = newUser._id.toString();
          const savedEmployee = await newEmployee.save();
          newUser.employeeId = new mongoose.Types.ObjectId(
            savedEmployee._id
          ) as any;
        } else {
          Object.assign(employeeToUpdate, employee);
          await employeeToUpdate.save();
        }
      }
      const savedUser = await newUser.save();
      const userToRes = savedUser.toObject();
      delete userToRes.password;
      return res.status(200).json(userToRes);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
  updateMail = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { fieldsToChange } = req.body;
    try {
      const mail = await MailModel.findByIdAndUpdate(
        id,
        { $set: fieldsToChange }, // Use $set to update only the specified fields
        { new: true }
      );
      if (!mail) {
        throw new Error(`Mail with ID ${id} not found`);
      }
      await mail.populate("employeeId");
      const user = await UserModel.findById(mail.employeeId.userId);
      if (!user) {
        throw new Error(`User ${id} not found`);
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
      if (user?.memberId?.articles) {
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
      if (user.employeeId) {
        const mails = await MailModel.find({ employeeId: user.employeeId });
        await user.populate({
          path: "employeeId",
          model: "Employee",
        });
        user.employeeId.mails = mails;
      }
      const userToRes = user.toJSON();
      delete userToRes.password;
      req.session.user = userToRes;
      return res.status(200).json(userToRes);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };

  createMail = async (req: express.Request, res: express.Response) => {
    let { mail } = req.body;
    try {
      const newMail = new MailModel({
        ...mail,
        sendTime: new Date().toISOString(),
        read: false,
        fromSend: req.session.user?.email,
      });
      const savedMail = await newMail.save();
      return res.status(200).json(savedMail);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}

export default new AdminController();
