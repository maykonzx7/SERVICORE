import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { RolePermissions } from "../../domain/value-objects/permission";

export interface ListAllPermissionsOutput {
  permissions: string[];
  groupedByResource: Record<string, string[]>;
}

export class ListAllPermissionsUseCase extends BaseUseCase<
  void,
  ListAllPermissionsOutput
> {
  async execute(): Promise<Result<ListAllPermissionsOutput>> {
    try {
      const allPermissions = RolePermissions.getAllPermissions();
      const groupedByResource = RolePermissions.getPermissionsByResource();

      return this.success({
        permissions: allPermissions,
        groupedByResource,
      });
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to list all permissions"
      );
    }
  }
}

