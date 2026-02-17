import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { UserId } from "../../domain/value-objects/user-id";

export interface GetCurrentUserInput {
  userId: string;
}

export interface GetCurrentUserOutput {
  user: User;
}

export class GetCurrentUserUseCase extends BaseUseCase<
  GetCurrentUserInput,
  GetCurrentUserOutput
> {
  constructor(private readonly repository: UserRepository) {
    super();
  }

  async execute(input: GetCurrentUserInput): Promise<Result<GetCurrentUserOutput>> {
    try {
      const userId = UserId.create(input.userId);
      
      const user = await this.repository.findById(userId);
      if (!user) {
        return this.failure("User not found");
      }

      return this.success({ user });
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to get current user"
      );
    }
  }
}

