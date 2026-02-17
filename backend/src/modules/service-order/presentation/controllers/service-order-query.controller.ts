import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from "@nestjs/common";
import { ListServiceOrdersQuery } from "../../application/queries/list-service-orders.query";
import { GetServiceOrderDetailsQuery } from "../../application/queries/get-service-order-details.query";
import { PaginationDto } from "@shared/application/dto";

/**
 * ServiceOrderQueryController
 *
 * Controller para operações de leitura (Read Side) de ordens de serviço
 */
@Controller("service-orders")
export class ServiceOrderQueryController {
  constructor(
    private readonly listQuery: ListServiceOrdersQuery,
    private readonly getDetailsQuery: GetServiceOrderDetailsQuery
  ) {}

  /**
   * Lista ordens de serviço com paginação
   * GET /service-orders?companyId=xxx&page=1&limit=10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query("companyId") companyId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    if (!companyId) {
      throw new BadRequestException("companyId is required");
    }

    const pagination = new PaginationDto(page, limit);
    return this.listQuery.execute({
      companyId,
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  /**
   * Busca detalhes de uma ordem de serviço
   * GET /service-orders/:id
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getDetails(@Param("id") id: string) {
    const result = await this.getDetailsQuery.execute({ id });

    if (!result) {
      throw new NotFoundException(`Service order with id ${id} not found`);
    }

    return result;
  }
}

