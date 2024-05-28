import cron from "@elysiajs/cron";
import Elysia from "elysia";

export default new Elysia().use(
  cron({
    name: "test-cron",
    pattern: "* */5 * * *",
    run() {
      console.log("Test cron running every 5 minutes");
    },
  }),
);
// TODO: Add more cron jobs on module calculator here
