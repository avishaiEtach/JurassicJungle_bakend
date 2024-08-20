import ArticlesRouter from "./ArticlesRouter";
import DinosaursRouter from "./DinosaursRouter";
import MembersRouter from "./MemberRouter";
import UsersRouter from "./UsersRouter";
import AdminRouter from "./AdminRouter";
import EmployeeRouter from "./EmployeeRouter";

const routes = [
  UsersRouter,
  MembersRouter,
  DinosaursRouter,
  ArticlesRouter,
  EmployeeRouter,
  AdminRouter,
];

export default routes;
