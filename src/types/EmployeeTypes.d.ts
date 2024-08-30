import { Mail } from "./MailTypes";

interface Employee {
  _id: string;
  image: string;
  jobTitleName: string;
  salary: number;
  address: string;
  department: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  userId: string;
  mails: Mail[];
}

export { Employee };
