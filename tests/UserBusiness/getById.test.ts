import { UserBusiness } from "../../src/business/UserBusiness";
import { GetByIdInputDTO, SignupInputDTO } from "../../src/dtos/userDTO";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { USER_ROLES } from "../../src/types";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";

describe("getById", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );
  test("Id não existe", () => {
    const input: GetByIdInputDTO = {
      idToFind: "teste",
    };
    expect(async () => {
      await userBusiness.getById(input);
    }).rejects.toBeInstanceOf(NotFoundError);
  });
  test("Usuário encontrado", async () => {
    const input: GetByIdInputDTO = {
      idToFind: "id-mock-normal",
    };
    const result = await userBusiness.getById(input);

    const expectedResult = {
      id: "id-mock-normal",
      name: "Normal Mock",
      email: "normal@email.com",
      password: "hash-bananinha",
      createdAt: expect.any(String),
      role: USER_ROLES.NORMAL,
    };
    expect(result.user).toEqual(expectedResult);
  });
});
