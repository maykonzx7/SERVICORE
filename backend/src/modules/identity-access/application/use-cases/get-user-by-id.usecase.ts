import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { UserId } from "../../domain/value-objects/user-id";

export interface GetUserByIdInput {
  id: string;
}

export class GetUserByIdUseCase extends BaseUseCase<GetUserByIdInput, User> {
  constructor(private readonly repository: UserRepository) {
    super();
  }

  async execute(input: GetUserByIdInput): Promise<Result<User>> {
    try {
      const userId = UserId.create(input.id);
      const user = await this.repository.findById(userId);

      if (!user) {
        return this.failure("User not found");
      }

      return this.success(user);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to get user"
      );
    }
  }
}

