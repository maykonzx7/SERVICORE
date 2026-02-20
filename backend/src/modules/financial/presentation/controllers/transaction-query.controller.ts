import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { ListTransactionsQuery } from "../../application/queries/list-transactions.query";
import { GetTransactionDetailsQuery } from "../../application/queries/get-transaction-details.query";
import { SearchTransactionsQuery } from "../../application/queries/search-transactions.query";
import { GetBalanceQuery } from "../../application/queries/get-balance.query";
import { GetSummaryQuery } from "../../application/queries/get-summary.query";
import { PaginationDto } from "@shared/application/dto";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionQueryController {
  constructor(
    private readonly listQuery: ListTransactionsQuery,
    private readonly getDetailsQuery: GetTransactionDetailsQuery,
    private readonly searchQuery: SearchTransactionsQuery,
    private readonly getBalanceQuery: GetBalanceQuery,
    private readonly getSummaryQuery: GetSummaryQuery
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Lista transações com paginação" })
  @ApiQuery({ name: "companyId", required: true })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
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

  @Post("search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Busca transações com filtros" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        companyId: { type: "string" },
        filters: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            status: { type: "string" },
            serviceOrderId: { type: "string" },
            paymentMethod: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            search: { type: "string" },
          },
        },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  async search(@Body() body: any) {
    const { companyId, filters, page = 1, limit = 10 } = body;

    if (!companyId) {
      throw new BadRequestException("companyId is required");
    }

    const pagination = new PaginationDto(page, limit);
    return this.searchQuery.execute({
      companyId,
      filters: filters || {},
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  @Get("balance")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Calcula o saldo da empresa" })
  @ApiQuery({ name: "companyId", required: true })
  @ApiQuery({ name: "startDate", required: false, type: String })
  @ApiQuery({ name: "endDate", required: false, type: String })
  async getBalance(
    @Query("companyId") companyId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    if (!companyId) {
      throw new BadRequestException("companyId is required");
    }

    return this.getBalanceQuery.execute({
      companyId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get("summary")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Calcula o resumo financeiro" })
  @ApiQuery({ name: "companyId", required: true })
  @ApiQuery({ name: "startDate", required: true, type: String })
  @ApiQuery({ name: "endDate", required: true, type: String })
  async getSummary(
    @Query("companyId") companyId: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    if (!companyId || !startDate || !endDate) {
      throw new BadRequestException(
        "companyId, startDate and endDate are required"
      );
    }

    return this.getSummaryQuery.execute({
      companyId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Busca detalhes de uma transação" })
  @ApiParam({ name: "id", description: "ID da transação" })
  async getDetails(@Param("id") id: string) {
    const result = await this.getDetailsQuery.execute({ id });

    if (!result) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return result;
  }
}

