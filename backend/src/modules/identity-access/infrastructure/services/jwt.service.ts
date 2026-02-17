import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserId } from "../../domain/value-objects/user-id";

export interface JwtPayload {
  sub: string; // userId
  email: string;
  roles: string[];
}

@Injectable()
export class IdentityJwtService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Gera um token JWT para o usuário
   */
  generateToken(
    userId: UserId | string,
    email: string,
    roles: string[]
  ): string {
    const userIdString = typeof userId === 'string' ? userId : userId.toString();
    
    const payload: JwtPayload = {
      sub: userIdString,
      email,
      roles,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Verifica e decodifica um token JWT
   */
  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  /**
   * Extrai o userId do token
   */
  extractUserId(token: string): UserId {
    const payload = this.verifyToken(token);
    return UserId.create(payload.sub);
  }
}

