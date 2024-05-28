import Elysia from "elysia";
import calculatorCron from "./calculator";

export default new Elysia()
  .use(calculatorCron);
// TODO: Add more cron here
