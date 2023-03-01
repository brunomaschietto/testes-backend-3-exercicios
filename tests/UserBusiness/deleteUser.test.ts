import { UserBusiness } from "../../src/business/UserBusiness";
import { DeleteUserInputDTO } from "../../src/dtos/userDTO";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { NotFoundError } from "../../src/errors/NotFoundError";

import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";

describe("delete", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );
  test("Token deve ser uma string", () => {
    const input: DeleteUserInputDTO = {
      idToDelete: "string",
      token: 2,
    };
    expect(async () => {
      await userBusiness.deleteUser(input);
    }).rejects.toBeInstanceOf(BadRequestError);
  });
  test("Token inválido", () => {
    const input: DeleteUserInputDTO = {
      idToDelete: "id-mock",
      token: "abobrinha",
    };
    expect(async () => {
      await userBusiness.deleteUser(input);
    }).rejects.toBeInstanceOf(BadRequestError);
  });
  test("Somente admins podem deletar contas", () => {
    const input: DeleteUserInputDTO = {
      idToDelete: "teste",
      token: "token-mock-normal",
    };
    expect(async () => {
      await userBusiness.deleteUser(input);
    }).rejects.toBeInstanceOf(BadRequestError);
  });
  test("Id não existe", () => {
    const input: DeleteUserInputDTO = {
      idToDelete: "teste",
      token: "token-mock-admin",
    };
    expect(async () => {
      await userBusiness.deleteUser(input);
    }).rejects.toBeInstanceOf(NotFoundError);
  });

  test("Deletando um usuário com sucesso", async () => {
    const input: DeleteUserInputDTO = {
        idToDelete: "id-mock-normal",
        token: "token-mock-admin"
    }
    const result = await userBusiness.deleteUser(input)
    expect(result).toBe("Usuário deletado")
  });
});
