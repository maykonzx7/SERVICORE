import { IsString, IsNotEmpty } from "class-validator";

export class RejectTransactionDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}

