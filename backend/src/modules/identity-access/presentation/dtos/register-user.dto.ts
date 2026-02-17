import { IsString, IsEmail, IsOptional, IsArray, MinLength, IsNotEmpty } from "class-validator";

/**
 * RegisterUserDto
 *
 * DTO para registro de novo usuário
 */
export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[];
}

