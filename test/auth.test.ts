import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import app from "../src/routes";

describe("Unit test auth routes", async () => {
  const loginResponse = await app
    .handle(
      new Request("http://localhost/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "admin",
          password: "admin",
        }),
      }),
    )
    .then((res) => res.json());

  it("sign in success", async () => {
    expect(loginResponse).toEqual({
      message: "Sign in success",
      status: true,
      data: {
        token: expect.any(String),
      },
    });
  });

  it("get profile unauthorized", async () => {
    const response = await app.handle(new Request("http://localhost/api/auth/profile")).then((res) => res.json());

    expect(response).toEqual({
      message: "Unauthorized",
      status: false,
    });
  });

  it("get profile authorized", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${loginResponse.data.token}`,
          },
        }),
      )
      .then((res) => res.json());

    expect(response).toEqual({
      message: "Profile",
      status: true,
      data: {
        profile: {
          username: "admin",
          password: "admin",
        },
      },
    });
  });
});
