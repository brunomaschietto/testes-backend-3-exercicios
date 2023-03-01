import { UserBusiness } from "../../src/business/UserBusiness";
import { LoginInputDTO } from "../../src/dtos/userDTO";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";

describe("login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("login bem-sucedido em conta normal retorna token", async () => {
    const input: LoginInputDTO = {
      email: "normal@email.com",
      password: "bananinha",
    };

    const response = await userBusiness.login(input);
    expect(response.token).toBe("token-mock-normal");
  });

  test("login bem-sucedido em conta admin retorna token", async () => {
    const input: LoginInputDTO = {
      email: "admin@email.com",
      password: "bananinha",
    };

    const response = await userBusiness.login(input);
    expect(response.token).toBe("token-mock-admin");
  });
  test("Email deve ser string", () => {
    const input: LoginInputDTO = {
      email: true,
      password: "bananinha",
    };
    expect(async () => {
      await userBusiness.login(input);
    }).rejects.toBeInstanceOf(Error);
  });
  test("Password deve ser string", () => {
    const input: LoginInputDTO = {
      email: "normal@email.com",
      password: 2,
    };
    expect(async () => {
      await userBusiness.login(input);
    }).rejects.toBeInstanceOf(BadRequestError);
  });
  test("Email não cadastrado", () => {
    const input: LoginInputDTO = {
      email: "example@email.com",
      password: "bananinha",
    };
    expect(async () => {
      await userBusiness.login(input);
    }).rejects.toBeInstanceOf(NotFoundError);
  });
  test("Password incorreto", () => {
    const input: LoginInputDTO = {
      email: "normal@email.com",
      password: "2",
    };
    expect(async () => {
      await userBusiness.login(input);
    }).rejects.toBeInstanceOf(BadRequestError);
  });
});
