import express from "express";
import { EmployeeModel } from "../db/models/employee";

class EmployeeController {
  getAllEmployees = async (req: express.Request, res: express.Response) => {
    try {
      let employees = await EmployeeModel.find({});
      for (let index = 0; index < employees.length; index++) {
        await employees[index].populate({
          path: "userId",
          model: "User",
        });
        let user = (employees[index].userId as any).toJSON();
        employees[index].userId = {
          email: user.email,
          employeeId: employees[index]._id,
          _id: user._id,
        } as any;
      }
      return res.status(200).json(employees);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}

export default new EmployeeController();
