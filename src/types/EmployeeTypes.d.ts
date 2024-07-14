interface Employee {
  image: string;
  jobTitleName: string;
  salary: number;
  address: string;
  department: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  userId: string;
}

export { Employee };
