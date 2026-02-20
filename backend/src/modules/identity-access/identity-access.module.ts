import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { RegisterUserUseCase } from "./application/use-cases/register-user.usecase";
import { LoginUserUseCase } from "./application/use-cases/login-user.usecase";
import { GetCurrentUserUseCase } from "./application/use-cases/get-current-user.usecase";
import { ListUsersUseCase } from "./application/use-cases/list-users.usecase";
import { GetUserByIdUseCase } from "./application/use-cases/get-user-by-id.usecase";
import { UpdateUserUseCase } from "./application/use-cases/update-user.usecase";
import { AssignUserRolesUseCase } from "./application/use-cases/assign-user-roles.usecase";
import { ListRolesUseCase } from "./application/use-cases/list-roles.usecase";
import { GetRolePermissionsUseCase } from "./application/use-cases/get-role-permissions.usecase";
import { ListAllPermissionsUseCase } from "./application/use-cases/list-all-permissions.usecase";
import { GetRolePermissionsMatrixUseCase } from "./application/use-cases/get-role-permissions-matrix.usecase";
import { UserRepository } from "./domain/repositories/user.repository";
import { PrismaUserRepository } from "./infrastructure/persistence/prisma-user.repository";
import { IdentityJwtService } from "./infrastructure/services/jwt.service";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { AuthController } from "./presentation/controllers/auth.controller";
import { UsersController } from "./presentation/controllers/users.controller";
import { RolesController } from "./presentation/controllers/roles.controller";
import { PermissionsController } from "./presentation/controllers/permissions.controller";

/**
 * IdentityAccessModule
 *
 * Módulo de autenticação e autorização
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    } as any),
  ],
  controllers: [
    AuthController,
    UsersController,
    RolesController,
    PermissionsController,
  ],
  providers: [
    // Infrastructure
    PrismaService,
    {
      provide: "UserRepository",
      useClass: PrismaUserRepository,
    },
    IdentityJwtService,
    JwtStrategy,
    // Use Cases
    {
      provide: RegisterUserUseCase,
      useFactory: (repository: UserRepository) => {
        return new RegisterUserUseCase(repository);
      },
      inject: ["UserRepository"],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (repository: UserRepository, jwtService: IdentityJwtService) => {
        return new LoginUserUseCase(repository, jwtService);
      },
      inject: ["UserRepository", IdentityJwtService],
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (repository: UserRepository) => {
        return new GetCurrentUserUseCase(repository);
      },
      inject: ["UserRepository"],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (repository: UserRepository) => {
        return new ListUsersUseCase(repository);
      },
      inject: ["UserRepository"],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (repository: UserRepository) => {
        return new GetUserByIdUseCase(repository);
      },
      inject: ["UserRepository"],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repository: UserRepository) => {
        return new UpdateUserUseCase(repository);
      },
      inject: ["UserRepository"],
    },
    {
      provide: AssignUserRolesUseCase,
      useFactory: (repository: UserRepository) => {
        return new AssignUserRolesUseCase(repository);
      },
      inject: ["UserRepository"],
    },
    {
      provide: ListRolesUseCase,
      useFactory: () => {
        return new ListRolesUseCase();
      },
    },
    {
      provide: GetRolePermissionsUseCase,
      useFactory: () => {
        return new GetRolePermissionsUseCase();
      },
    },
    {
      provide: ListAllPermissionsUseCase,
      useFactory: () => {
        return new ListAllPermissionsUseCase();
      },
    },
    {
      provide: GetRolePermissionsMatrixUseCase,
      useFactory: () => {
        return new GetRolePermissionsMatrixUseCase();
      },
    },
  ],
  exports: ["UserRepository", IdentityJwtService],
})
export class IdentityAccessModule {}

