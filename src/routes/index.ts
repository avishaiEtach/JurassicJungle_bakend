import ArticlesRouter from "./ArticlesRouter";
import DinosaursRouter from "./DinosaursRouter";
import MembersRouter from "./MemberRouter";
import UsersRouter from "./UsersRouter";
import AdminRouter from "./AdminRouter";

const routes = [
  UsersRouter,
  MembersRouter,
  DinosaursRouter,
  ArticlesRouter,
  AdminRouter,
];

export default routes;
