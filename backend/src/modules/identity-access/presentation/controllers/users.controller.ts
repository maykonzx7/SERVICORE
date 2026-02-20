import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase";
import { ListUsersUseCase } from "../../application/use-cases/list-users.usecase";
import { GetUserByIdUseCase } from "../../application/use-cases/get-user-by-id.usecase";
import { UpdateUserUseCase } from "../../application/use-cases/update-user.usecase";
import { AssignUserRolesUseCase } from "../../application/use-cases/assign-user-roles.usecase";
import { JwtAuthGuard } from "../../infrastructure/guards/jwt-auth.guard";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { AssignUserRolesDto } from "../dtos/assign-user-roles.dto";
import { ListUsersQueryDto } from "../dtos/list-users-query.dto";
import { User } from "../../domain/entities/user";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly assignUserRolesUseCase: AssignUserRolesUseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista usuários com paginação e filtros" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "role", required: false, type: String })
  @ApiQuery({ name: "active", required: false, type: Boolean })
  @ApiResponse({ status: 200, description: "Lista de usuários" })
  async list(@Query() query: ListUsersQueryDto) {
    const result = await this.listUsersUseCase.execute(query);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return {
      data: result.value.users.map((user) => this.toUserResponse(user)),
      pagination: result.value.pagination,
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Retorna detalhes de um usuário" })
  @ApiParam({ name: "id", description: "ID do usuário" })
  @ApiResponse({ status: 200, description: "Detalhes do usuário" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async getById(@Param("id") id: string) {
    const result = await this.getUserByIdUseCase.execute({ id });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return this.toUserResponse(result.value);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Cria um novo usuário" })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
  async create(@Body() dto: RegisterUserDto) {
    const result = await this.registerUseCase.execute(dto);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return this.toUserResponse(result.value);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Atualiza dados do usuário" })
  @ApiParam({ name: "id", description: "ID do usuário" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso" })
  async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    const result = await this.updateUserUseCase.execute({ id, ...dto });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return this.toUserResponse(result.value);
  }

  @Put(":id/roles")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Atribui roles para o usuário" })
  @ApiParam({ name: "id", description: "ID do usuário" })
  @ApiBody({ type: AssignUserRolesDto })
  @ApiResponse({ status: 200, description: "Roles atualizados com sucesso" })
  async assignRoles(@Param("id") id: string, @Body() dto: AssignUserRolesDto) {
    const result = await this.assignUserRolesUseCase.execute({
      userId: id,
      roles: dto.roles,
    });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return this.toUserResponse(result.value);
  }

  private toUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email.toString(),
      name: user.name,
      roles: user.roles.map((role) => role.toString()),
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

