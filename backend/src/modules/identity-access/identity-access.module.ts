import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "@shared/infrastructure/prisma.service";
import { RegisterUserUseCase } from "./application/use-cases/register-user.usecase";
import { LoginUserUseCase } from "./application/use-cases/login-user.usecase";
import { GetCurrentUserUseCase } from "./application/use-cases/get-current-user.usecase";
import { UserRepository } from "./domain/repositories/user.repository";
import { PrismaUserRepository } from "./infrastructure/persistence/prisma-user.repository";
import { IdentityJwtService } from "./infrastructure/services/jwt.service";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { AuthController } from "./presentation/controllers/auth.controller";

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
  controllers: [AuthController],
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
  ],
  exports: ["UserRepository", IdentityJwtService],
})
export class IdentityAccessModule {}

