import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Get,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.usecase";
import { UpdateTransactionUseCase } from "../../application/use-cases/update-transaction.usecase";
import { ApproveTransactionUseCase } from "../../application/use-cases/approve-transaction.usecase";
import { RejectTransactionUseCase } from "../../application/use-cases/reject-transaction.usecase";
import { ProcessTransactionUseCase } from "../../application/use-cases/process-transaction.usecase";
import { CancelTransactionUseCase } from "../../application/use-cases/cancel-transaction.usecase";
import { CreateTransactionDto } from "../dtos/create-transaction.dto";
import { UpdateTransactionDto } from "../dtos/update-transaction.dto";
import { RejectTransactionDto } from "../dtos/reject-transaction.dto";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionController {
  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
    private readonly updateUseCase: UpdateTransactionUseCase,
    private readonly approveUseCase: ApproveTransactionUseCase,
    private readonly rejectUseCase: RejectTransactionUseCase,
    private readonly processUseCase: ProcessTransactionUseCase,
    private readonly cancelUseCase: CancelTransactionUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Cria uma nova transação" })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: "Transação criada com sucesso",
  })
  async create(@Body() dto: CreateTransactionDto) {
    const result = await this.createUseCase.execute(dto);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return {
      id: result.value?.getId().toString(),
      companyId: result.value?.companyId.toString(),
      type: result.value?.type.toString(),
      amount: result.value?.amount.getAmount(),
      currency: result.value?.currency,
      description: result.value?.description,
      status: result.value?.status.toString(),
      serviceOrderId: result.value?.serviceOrderId?.toString() || null,
      paymentMethod: result.value?.paymentMethod?.toString() || null,
      dueDate: result.value?.dueDate,
      createdAt: result.value?.createdAt,
    };
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Atualiza uma transação" })
  @ApiParam({ name: "id", description: "ID da transação" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateTransactionDto
  ) {
    const result = await this.updateUseCase.execute({ id, ...dto });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return { message: "Transaction updated successfully" };
  }

  @Put(":id/approve")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Aprova uma transação" })
  @ApiParam({ name: "id", description: "ID da transação" })
  async approve(@Param("id") id: string, @Query("approvedBy") approvedBy: string) {
    const result = await this.approveUseCase.execute({ id, approvedBy });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return { message: "Transaction approved successfully" };
  }

  @Put(":id/reject")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rejeita uma transação" })
  @ApiParam({ name: "id", description: "ID da transação" })
  async reject(
    @Param("id") id: string,
    @Body() dto: RejectTransactionDto,
    @Query("rejectedBy") rejectedBy: string
  ) {
    const result = await this.rejectUseCase.execute({
      id,
      rejectedBy,
      reason: dto.reason,
    });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return { message: "Transaction rejected successfully" };
  }

  @Put(":id/process")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Processa uma transação" })
  @ApiParam({ name: "id", description: "ID da transação" })
  async process(@Param("id") id: string) {
    const result = await this.processUseCase.execute({ id });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return { message: "Transaction processed successfully" };
  }

  @Put(":id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cancela uma transação" })
  @ApiParam({ name: "id", description: "ID da transação" })
  async cancel(@Param("id") id: string) {
    const result = await this.cancelUseCase.execute({ id });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return { message: "Transaction cancelled successfully" };
  }
}

