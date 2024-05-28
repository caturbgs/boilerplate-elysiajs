import { describe, expect, it } from "bun:test";
import app from "../src/routes";

describe("Unit test root routes", () => {
  it("get root", async () => {
    const response = await app.handle(new Request("http://localhost/api/")).then((res) => res.text());

    expect(response).toBe("Root API!");
  });
});
