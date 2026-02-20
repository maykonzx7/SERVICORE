import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@modules/identity-access/infrastructure/guards/jwt-auth.guard";
import { CreateCompanyUseCase } from "../../application/use-cases/create-company.usecase";
import { UpdateCompanyUseCase } from "../../application/use-cases/update-company.usecase";
import { GetCompanyByIdUseCase } from "../../application/use-cases/get-company-by-id.usecase";
import { ListCompaniesUseCase } from "../../application/use-cases/list-companies.usecase";
import { GetCompanyStatisticsUseCase } from "../../application/use-cases/get-company-statistics.usecase";
import { CreateCompanyDto } from "../dtos/create-company.dto";
import { UpdateCompanyDto } from "../dtos/update-company.dto";
import { ListCompaniesQueryDto } from "../dtos/list-companies-query.dto";
import { Company } from "../../domain/entities/company";

/**
 * CompanyController
 *
 * Controller para operações de empresas
 */
@ApiTags("companies")
@Controller("companies")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
    private readonly getCompanyStatisticsUseCase: GetCompanyStatisticsUseCase
  ) {}

  /**
   * Lista empresas
   * GET /companies
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista empresas com paginação e filtros" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "ownerId", required: false, type: String })
  @ApiQuery({ name: "active", required: false, type: Boolean })
  @ApiQuery({ name: "document", required: false, type: String })
  @ApiQuery({ name: "sortBy", required: false, enum: ["name", "createdAt", "document"] })
  @ApiQuery({ name: "sortOrder", required: false, enum: ["asc", "desc"] })
  @ApiResponse({
    status: 200,
    description: "Lista de empresas retornada com sucesso",
  })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  async listCompanies(
    @Query() query: ListCompaniesQueryDto,
    @Request() req: any
  ) {
    // Se não especificar ownerId, filtra pelo usuário autenticado
    const ownerId = query.ownerId || req.user?.userId;

    if (!ownerId) {
      throw new BadRequestException("User ID not found in token");
    }

    const result = await this.listCompaniesUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      ownerId,
      active: query.active,
      document: query.document,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return {
      data: result.value.companies.map((company) =>
        this.toCompanyResponse(company)
      ),
      pagination: result.value.pagination,
    };
  }

  /**
   * Obtém empresa por ID
   * GET /companies/:id
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Obtém empresa por ID" })
  @ApiParam({ name: "id", description: "ID da empresa" })
  @ApiResponse({
    status: 200,
    description: "Empresa retornada com sucesso",
  })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async getCompanyById(@Param("id") id: string) {
    const result = await this.getCompanyByIdUseCase.execute({ id });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return this.toCompanyResponse(result.value);
  }

  /**
   * Cria uma nova empresa
   * POST /companies
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Cria uma nova empresa" })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: 201,
    description: "Empresa criada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  async createCompany(
    @Body() dto: CreateCompanyDto,
    @Request() req: any
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestException("User ID not found in token");
    }

    const result = await this.createCompanyUseCase.execute({
      ...dto,
      ownerId: userId,
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return this.toCompanyResponse(result.value);
  }

  /**
   * Atualiza uma empresa
   * PUT /companies/:id
   */
  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Atualiza dados da empresa" })
  @ApiParam({ name: "id", description: "ID da empresa" })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: 200,
    description: "Empresa atualizada com sucesso",
  })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async updateCompany(
    @Param("id") id: string,
    @Body() dto: UpdateCompanyDto
  ) {
    const result = await this.updateCompanyUseCase.execute({
      id,
      ...dto,
    });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return this.toCompanyResponse(result.value);
  }

  /**
   * Deleta uma empresa (soft delete - desativa)
   * DELETE /companies/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Desativa uma empresa" })
  @ApiParam({ name: "id", description: "ID da empresa" })
  @ApiResponse({
    status: 204,
    description: "Empresa desativada com sucesso",
  })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async deleteCompany(@Param("id") id: string) {
    const result = await this.updateCompanyUseCase.execute({
      id,
      active: false,
    });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }
  }

  /**
   * Obtém estatísticas da empresa
   * GET /companies/:id/statistics
   */
  @Get(":id/statistics")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Obtém estatísticas da empresa" })
  @ApiParam({ name: "id", description: "ID da empresa" })
  @ApiResponse({
    status: 200,
    description: "Estatísticas retornadas com sucesso",
  })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  async getStatistics(@Param("id") id: string) {
    const result = await this.getCompanyStatisticsUseCase.execute({
      companyId: id,
    });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  private toCompanyResponse(company: Company) {
    return {
      id: company.id.toString(),
      name: company.name,
      document: company.document,
      email: company.email,
      phone: company.phone,
      address: company.address,
      city: company.city,
      state: company.state,
      zipCode: company.zipCode,
      ownerId: company.ownerId.toString(),
      active: company.active,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}

