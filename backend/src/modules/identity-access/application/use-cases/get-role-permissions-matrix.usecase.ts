import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { Role } from "../../domain/value-objects/role";
import { RolePermissions } from "../../domain/value-objects/permission";

export interface RolePermissionsMatrixOutput {
  matrix: Array<{
    role: string;
    permissions: string[];
    userCount?: number;
  }>;
  allPermissions: string[];
}

export class GetRolePermissionsMatrixUseCase extends BaseUseCase<
  void,
  RolePermissionsMatrixOutput
> {
  async execute(): Promise<Result<RolePermissionsMatrixOutput>> {
    try {
      const validRoles = Role.getValidRoles();
      const allPermissions = RolePermissions.getAllPermissions();

      const matrix = validRoles.map((role) => ({
        role,
        permissions: RolePermissions.getPermissionsByRole(role),
      }));

      return this.success({
        matrix,
        allPermissions,
      });
    } catch (error) {
      return this.failure(
        error instanceof Error
          ? error.message
          : "Failed to get role permissions matrix"
      );
    }
  }
}

