import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/value-objects/email";
import { Password } from "../../domain/value-objects/password";
import { Role } from "../../domain/value-objects/role";

export interface RegisterUserInput {
  email: string;
  password: string;
  name?: string;
  roles?: string[];
}

export class RegisterUserUseCase extends BaseUseCase<
  RegisterUserInput,
  User
> {
  constructor(private readonly repository: UserRepository) {
    super();
  }

  async execute(input: RegisterUserInput): Promise<Result<User>> {
    try {
      // Criar Value Objects
      const email = Email.create(input.email);
      const password = await Password.create(input.password);
      const roles = input.roles
        ? input.roles.map((r) => Role.create(r))
        : [Role.create("USER")];

      // Verificar se o email já está em uso
      const emailExists = await this.repository.existsByEmail(email);
      if (emailExists) {
        return this.failure("Email already in use");
      }

      // Criar Aggregate
      const user = await User.create(email, password, input.name || null, roles);

      // Persistir
      await this.repository.save(user);

      return this.success(user);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to register user"
      );
    }
  }
}

