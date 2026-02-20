import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { Role } from "../../domain/value-objects/role";

export interface ListRolesOutput {
  roles: readonly string[];
}

export class ListRolesUseCase extends BaseUseCase<void, ListRolesOutput> {
  async execute(): Promise<Result<ListRolesOutput>> {
    return this.success({ roles: Role.getValidRoles() });
  }
}

