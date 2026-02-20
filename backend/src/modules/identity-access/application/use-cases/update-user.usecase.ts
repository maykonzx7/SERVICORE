import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";
import { UserId } from "../../domain/value-objects/user-id";
import { Email } from "../../domain/value-objects/email";
import { Role } from "../../domain/value-objects/role";

export interface UpdateUserInput {
  id: string;
  email?: string;
  name?: string | null;
  active?: boolean;
  roles?: string[];
}

export class UpdateUserUseCase extends BaseUseCase<UpdateUserInput, User> {
  constructor(private readonly repository: UserRepository) {
    super();
  }

  async execute(input: UpdateUserInput): Promise<Result<User>> {
    try {
      const userId = UserId.create(input.id);
      const user = await this.repository.findById(userId);

      if (!user) {
        return this.failure("User not found");
      }

      if (input.email) {
        const nextEmail = Email.create(input.email);
        const existing = await this.repository.findByEmail(nextEmail);
        if (existing && existing.id !== user.id) {
          return this.failure("Email already in use");
        }
        user.changeEmail(nextEmail);
      }

      if (typeof input.name !== "undefined") {
        user.changeName(input.name ? input.name.trim() : null);
      }

      if (typeof input.active === "boolean") {
        if (input.active) {
          user.activate();
        } else {
          user.deactivate();
        }
      }

      if (input.roles) {
        const uniqueRoles = Array.from(new Set(input.roles.map((r) => r.toUpperCase())));
        user.replaceRoles(uniqueRoles.map((role) => Role.create(role)));
      }

      await this.repository.save(user);
      return this.success(user);
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to update user"
      );
    }
  }
}

