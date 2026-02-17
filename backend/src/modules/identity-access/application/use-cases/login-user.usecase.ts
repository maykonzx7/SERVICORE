import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/value-objects/email";
import { IdentityJwtService } from "../../infrastructure/services/jwt.service";

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  user: User;
  token: string; // JWT token (será implementado depois)
}

export class LoginUserUseCase extends BaseUseCase<
  LoginUserInput,
  LoginUserOutput
> {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: IdentityJwtService
  ) {
    super();
  }

  async execute(input: LoginUserInput): Promise<Result<LoginUserOutput>> {
    try {
      // Criar Value Object
      const email = Email.create(input.email);

      // Buscar usuário
      const user = await this.repository.findByEmail(email);
      if (!user) {
        return this.failure("Invalid credentials");
      }

      // Autenticar
      const isValid = await user.authenticate(input.password);
      if (!isValid) {
        return this.failure("Invalid credentials");
      }

      // Gerar JWT token
      const token = this.jwtService.generateToken(
        user.id,
        user.email.toString(),
        user.roles.map((r) => r.toString())
      );

      return this.success({ user, token });
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to login"
      );
    }
  }
}

