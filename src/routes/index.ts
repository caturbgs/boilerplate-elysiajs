import Elysia from "elysia";
import authRoutes from "./auth";
import calculatorRoutes from "./calculator";
import userRoutes from "./user";

export default new Elysia({ prefix: "/api" })
  .get("/", () => "Root API!")
  .use(authRoutes)
  .use(userRoutes)
  .use(calculatorRoutes);
// TODO: Add more routes here
