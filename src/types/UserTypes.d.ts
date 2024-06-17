import mongoose from "mongoose";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  dob: Date;
  permissions?: 1 | 2 | 3 | 4;
  favArticles: string[];
  memberId?: any;
}

export { User };
