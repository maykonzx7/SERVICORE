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
} from "@nestjs/common";
import { CreateServiceOrderUseCase } from "../../application/use-cases/create-service-order.usecase";
import { StartServiceOrderUseCase } from "../../application/use-cases/start-service-order.usecase";
import { CompleteServiceOrderUseCase } from "../../application/use-cases/complete-service-order.usecase";
import { CancelServiceOrderUseCase } from "../../application/use-cases/cancel-service-order.usecase";
import { CreateServiceOrderDto } from "../dtos/create-service-order.dto";

/**
 * ServiceOrderController
 *
 * Controller para operações de escrita (Write Side) de ordens de serviço
 */
@Controller("service-orders")
export class ServiceOrderController {
  constructor(
    private readonly createUseCase: CreateServiceOrderUseCase,
    private readonly startUseCase: StartServiceOrderUseCase,
    private readonly completeUseCase: CompleteServiceOrderUseCase,
    private readonly cancelUseCase: CancelServiceOrderUseCase
  ) {}

  /**
   * Cria uma nova ordem de serviço
   * POST /service-orders
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateServiceOrderDto) {
    const result = await this.createUseCase.execute(dto);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return {
      id: result.value?.getId().toString(),
      companyId: result.value?.companyId.toString(),
      description: result.value?.description,
      priority: result.value?.priority.toString(),
      value: result.value?.value.getAmount(),
      status: result.value?.status.toString(),
      createdAt: result.value?.createdAt,
    };
  }

  /**
   * Inicia uma ordem de serviço
   * PUT /service-orders/:id/start
   */
  @Put(":id/start")
  @HttpCode(HttpStatus.OK)
  async start(@Param("id") id: string) {
    const result = await this.startUseCase.execute({ serviceOrderId: id });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return {
      id: result.value?.getId().toString(),
      status: result.value?.status.toString(),
      message: "Service order started successfully",
    };
  }

  /**
   * Finaliza uma ordem de serviço
   * PUT /service-orders/:id/complete
   */
  @Put(":id/complete")
  @HttpCode(HttpStatus.OK)
  async complete(@Param("id") id: string) {
    const result = await this.completeUseCase.execute({ serviceOrderId: id });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return {
      id: result.value?.getId().toString(),
      status: result.value?.status.toString(),
      message: "Service order completed successfully",
    };
  }

  /**
   * Cancela uma ordem de serviço
   * PUT /service-orders/:id/cancel
   */
  @Put(":id/cancel")
  @HttpCode(HttpStatus.OK)
  async cancel(@Param("id") id: string) {
    const result = await this.cancelUseCase.execute({ serviceOrderId: id });

    if (result.isFailure) {
      if (result.error.includes("not found")) {
        throw new NotFoundException(result.error);
      }
      throw new BadRequestException(result.error);
    }

    return {
      id: result.value?.getId().toString(),
      status: result.value?.status.toString(),
      message: "Service order cancelled successfully",
    };
  }
}

