import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user";

export interface ListUsersInput {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  active?: boolean;
}

export interface ListUsersOutput {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ListUsersUseCase extends BaseUseCase<ListUsersInput, ListUsersOutput> {
  constructor(private readonly repository: UserRepository) {
    super();
  }

  async execute(input: ListUsersInput): Promise<Result<ListUsersOutput>> {
    try {
      const page = input.page && input.page > 0 ? input.page : 1;
      const limit = input.limit && input.limit > 0 ? input.limit : 10;

      const { users, total } = await this.repository.findMany({
        page,
        limit,
        search: input.search,
        role: input.role,
        active: input.active,
      });

      return this.success({
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to list users"
      );
    }
  }
}

