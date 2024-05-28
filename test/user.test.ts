import { describe, expect, it } from "bun:test";
import app from "../src/routes";

describe("Unit test user routes", async () => {
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

  it("get all users", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api/user/", {
          headers: {
            Authorization: `Bearer ${loginResponse.data.token}`,
          },
        }),
      )
      .then((res) => res.json());

    expect(response).toEqual({
      message: "Success get all users",
      data: expect.any(Array),
    });
  });

  it("get user by id failed", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/api/user/1", {
          headers: {
            Authorization: `Bearer ${loginResponse.data.token}`,
          },
        }),
      )
      .then((res) => res.json());

    expect(response).not.toEqual({
      message: "Success get user by id",
      data: {
        id: 1,
        name: "John Doe",
        email: "john",
      },
    });
  });

  it("get user by id success", async () => {
    const uuidV4 = "f4b5f1b0-1b9b-4b4b-8b1b-3e1b4b1b4b1b";
    const response = await app
      .handle(
        new Request(`http://localhost/api/user/${uuidV4}`, {
          headers: {
            Authorization: `Bearer ${loginResponse.data.token}`,
          },
        }),
      )
      .then((res) => res.json());

    expect(response).toEqual({
      message: "Success get user by id",
      data: {
        id: 1,
        name: "John Doe",
        email: "john",
      },
    });
  });
});
