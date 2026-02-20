import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../infrastructure/guards/jwt-auth.guard";
import { ListAllPermissionsUseCase } from "../../application/use-cases/list-all-permissions.usecase";

@ApiTags("permissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("permissions")
export class PermissionsController {
  constructor(
    private readonly listAllPermissionsUseCase: ListAllPermissionsUseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista todas as permissões do sistema" })
  @ApiResponse({
    status: 200,
    description: "Permissões retornadas com sucesso",
  })
  async list() {
    const result = await this.listAllPermissionsUseCase.execute();

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}

