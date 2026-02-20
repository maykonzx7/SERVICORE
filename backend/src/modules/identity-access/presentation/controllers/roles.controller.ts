import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../infrastructure/guards/jwt-auth.guard";
import { ListRolesUseCase } from "../../application/use-cases/list-roles.usecase";
import { GetRolePermissionsUseCase } from "../../application/use-cases/get-role-permissions.usecase";
import { GetRolePermissionsMatrixUseCase } from "../../application/use-cases/get-role-permissions-matrix.usecase";

@ApiTags("roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("roles")
export class RolesController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
    private readonly getRolePermissionsMatrixUseCase: GetRolePermissionsMatrixUseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista roles válidos do sistema" })
  @ApiResponse({ status: 200, description: "Roles retornados com sucesso" })
  async list() {
    const result = await this.listRolesUseCase.execute();

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Get(":role/permissions")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Retorna permissões de um role específico" })
  @ApiParam({ name: "role", description: "Nome do role" })
  @ApiResponse({ status: 200, description: "Permissões do role retornadas com sucesso" })
  @ApiResponse({ status: 400, description: "Role inválido" })
  async getPermissions(@Param("role") role: string) {
    const result = await this.getRolePermissionsUseCase.execute({ role });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Get("matrix/permissions")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Retorna matriz completa de roles x permissões" })
  @ApiResponse({
    status: 200,
    description: "Matriz de roles e permissões retornada com sucesso",
  })
  async getPermissionsMatrix() {
    const result = await this.getRolePermissionsMatrixUseCase.execute();

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}

