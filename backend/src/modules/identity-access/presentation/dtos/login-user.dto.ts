import { IsString, IsEmail, IsNotEmpty } from "class-validator";

/**
 * LoginUserDto
 *
 * DTO para login de usuário
 */
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

