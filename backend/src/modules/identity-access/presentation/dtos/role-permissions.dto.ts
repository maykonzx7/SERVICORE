import { ApiProperty } from "@nestjs/swagger";

export class RolePermissionsDto {
  @ApiProperty({ description: "Nome do role" })
  role: string;

  @ApiProperty({ description: "Lista de permissões do role", type: [String] })
  permissions: string[];

  @ApiProperty({ description: "Descrição do role", required: false })
  description?: string;
}

export class PermissionGroupDto {
  @ApiProperty({ description: "Recurso (ex: service-order)" })
  resource: string;

  @ApiProperty({ description: "Ações disponíveis para o recurso", type: [String] })
  actions: string[];
}

export class AllPermissionsDto {
  @ApiProperty({ description: "Lista de todas as permissões", type: [String] })
  permissions: string[];

  @ApiProperty({
    description: "Permissões agrupadas por recurso",
    type: "object",
    additionalProperties: { type: "array", items: { type: "string" } },
  })
  groupedByResource: Record<string, string[]>;
}

export class RolePermissionsMatrixDto {
  @ApiProperty({
    description: "Matriz de roles e suas permissões",
    type: "array",
    items: {
      type: "object",
      properties: {
        role: { type: "string" },
        permissions: { type: "array", items: { type: "string" } },
      },
    },
  })
  matrix: Array<{
    role: string;
    permissions: string[];
  }>;

  @ApiProperty({ description: "Todas as permissões disponíveis", type: [String] })
  allPermissions: string[];
}

