import { Employee } from "./EmployeeTypes";

interface Mail {
  subject: string;
  description: string;
  sendTime: Date;
  read: boolean;
  fromSend: string;
  employeeId: Employee;
}

export { Mail };
