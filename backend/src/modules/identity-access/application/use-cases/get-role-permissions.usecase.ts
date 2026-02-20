import { BaseUseCase } from "@shared/application/base-use-case";
import { Result } from "@shared/application/result";
import { Role } from "../../domain/value-objects/role";
import { RolePermissions } from "../../domain/value-objects/permission";

export interface GetRolePermissionsInput {
  role: string;
}

export interface GetRolePermissionsOutput {
  role: string;
  permissions: string[];
  description?: string;
}

export class GetRolePermissionsUseCase extends BaseUseCase<
  GetRolePermissionsInput,
  GetRolePermissionsOutput
> {
  async execute(
    input: GetRolePermissionsInput
  ): Promise<Result<GetRolePermissionsOutput>> {
    try {
      // Validar se o role é válido
      Role.create(input.role);

      const permissions = RolePermissions.getPermissionsByRole(input.role);

      const descriptions: Record<string, string> = {
        ADMIN: "Acesso total ao sistema",
        COMPANY_ADMIN: "Administrador de uma empresa específica",
        MANAGER: "Gerente com permissões de gestão",
        TECHNICIAN: "Técnico que executa serviços",
        CLIENT: "Cliente que solicita serviços",
        USER: "Usuário básico do sistema",
      };

      return this.success({
        role: input.role.toUpperCase(),
        permissions,
        description: descriptions[input.role.toUpperCase()],
      });
    } catch (error) {
      return this.failure(
        error instanceof Error ? error.message : "Failed to get role permissions"
      );
    }
  }
}

