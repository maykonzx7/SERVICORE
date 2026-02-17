import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/identity-access/infrastructure/guards/jwt-auth.guard";

/**
 * CompanyController
 *
 * Controller para operações de empresas
 * TODO: Implementar módulo completo de organização
 */
@ApiTags("companies")
@Controller("companies")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  /**
   * Lista empresas do usuário autenticado
   * GET /companies
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista empresas do usuário autenticado" })
  @ApiResponse({
    status: 200,
    description: "Lista de empresas retornada com sucesso",
  })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  async listCompanies() {
    // TODO: Implementar busca real de empresas do usuário
    // Por enquanto, retorna lista vazia
    return [];
  }

  /**
   * Obtém empresa por ID
   * GET /companies/:id
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Obtém empresa por ID" })
  @ApiResponse({
    status: 200,
    description: "Empresa retornada com sucesso",
  })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async getCompanyById() {
    // TODO: Implementar busca real de empresa
    return {
      message: "Endpoint não implementado ainda",
    };
  }
}

