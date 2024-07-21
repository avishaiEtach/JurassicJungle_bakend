import mongoose from "mongoose";
import { Member } from "./MemberTypes";
import { Employee } from "./EmployeeTypes";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  dob: Date;
  permissions?: 1 | 2 | 3 | 4;
  favArticles: string[];
  memberId?: Member;
  employeeId?: Employee;
}

export { User };
