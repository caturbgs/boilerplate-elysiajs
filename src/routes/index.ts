import type { ElysiaGlobalApp } from "../types/elysia";

export default (app: ElysiaGlobalApp) => app.get("/", () => "Root API!");
