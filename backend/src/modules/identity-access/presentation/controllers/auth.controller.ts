import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase";
import { LoginUserUseCase } from "../../application/use-cases/login-user.usecase";
import { GetCurrentUserUseCase } from "../../application/use-cases/get-current-user.usecase";
import { JwtAuthGuard } from "../../infrastructure/guards/jwt-auth.guard";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { LoginUserDto } from "../dtos/login-user.dto";

/**
 * AuthController
 *
 * Controller para operações de autenticação
 */
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  /**
   * Registra um novo usuário
   * POST /auth/register
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registra um novo usuário" })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: "Usuário registrado com sucesso",
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async register(@Body() dto: RegisterUserDto) {
    const result = await this.registerUseCase.execute(dto);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    const user = result.value!;

    return {
      id: user.id,
      email: user.email.toString(),
      name: user.name,
      roles: user.roles.map((r) => r.toString()),
      createdAt: user.createdAt,
    };
  }

  /**
   * Realiza login do usuário
   * POST /auth/login
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Realiza login do usuário" })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: "Login realizado com sucesso",
  })
  @ApiResponse({ status: 400, description: "Credenciais inválidas" })
  async login(@Body() dto: LoginUserDto) {
    const result = await this.loginUseCase.execute(dto);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    const { user, token } = result.value!;

    return {
      token,
      user: {
        id: user.id,
        email: user.email.toString(),
        name: user.name,
        roles: user.roles.map((r) => r.toString()),
      },
    };
  }

  /**
   * Retorna o usuário atual autenticado
   * GET /auth/me
   */
  @Get("me")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Retorna o usuário atual autenticado" })
  @ApiResponse({
    status: 200,
    description: "Usuário retornado com sucesso",
  })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async getCurrentUser(@Request() req: any) {
    // O JwtAuthGuard valida o token e adiciona os dados do usuário em req.user
    const userId = req.user?.userId;

    if (!userId) {
      throw new BadRequestException("User ID not found in token");
    }

    const result = await this.getCurrentUserUseCase.execute({ userId });

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    const { user } = result.value!;

    return {
      id: user.id,
      email: user.email.toString(),
      name: user.name,
      roles: user.roles.map((r) => r.toString()),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Realiza logout do usuário
   * POST /auth/logout
   */
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Realiza logout do usuário" })
  @ApiResponse({
    status: 200,
    description: "Logout realizado com sucesso",
  })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  async logout() {
    // TODO: Implementar invalidação de token (blacklist) se necessário
    // Por enquanto, apenas retorna sucesso
    // O frontend já limpa o token do localStorage
    return {
      message: "Logout realizado com sucesso",
    };
  }
}

