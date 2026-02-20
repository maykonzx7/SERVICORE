import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { UserId } from "../../domain/value-objects/user-id";
import { Role } from "../../domain/value-objects/role";

export interface AssignUserRolesInput {
  userId: string;
  roles: string[];
}

export class AssignUserRolesUseCase extends BaseUseCase<
  AssignUserRolesInput,
  User
> {
  constructor(private readonly repository: UserRepository) {
    super();
  }

  async execute(input: AssignUserRolesInput): Promise<Result<User>> {
    try {
      const userId = UserId.create(input.userId);
      const user = await this.repository.findById(userId);

      if (!user) {
        return this.failure("User not found");
      }

      const uniqueRoles = Array.from(new Set(input.roles.map((role) => role.toUpperCase())));
      user.replaceRoles(uniqueRoles.map((role) => Role.create(role)));

      await this.repository.save(user);
      return this.success(user);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to assign roles to user"
      );
    }
  }
}

