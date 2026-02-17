import { CreateServiceOrderUseCase } from "../create-service-order.usecase";
import { ServiceOrderRepository } from "../../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../../domain/entities/service-order";

describe("CreateServiceOrderUseCase", () => {
  let useCase: CreateServiceOrderUseCase;
  let mockRepository: jest.Mocked<ServiceOrderRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByCompanyId: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new CreateServiceOrderUseCase(mockRepository);
  });

  it("should create a service order successfully", async () => {
    const input = {
      companyId: "company-123",
      description: "Test service order",
      priority: "HIGH",
      value: 100.5,
    };

    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(result.value).toBeInstanceOf(ServiceOrder);
  });

  it("should return failure for invalid company ID", async () => {
    const input = {
      companyId: "",
      description: "Test service order",
      priority: "HIGH",
      value: 100.5,
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("should return failure for invalid priority", async () => {
    const input = {
      companyId: "company-123",
      description: "Test service order",
      priority: "INVALID",
      value: 100.5,
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("should return failure for negative value", async () => {
    const input = {
      companyId: "company-123",
      description: "Test service order",
      priority: "HIGH",
      value: -100,
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("should return failure if repository throws error", async () => {
    mockRepository.save.mockRejectedValue(new Error("Database error"));

    const input = {
      companyId: "company-123",
      description: "Test service order",
      priority: "HIGH",
      value: 100.5,
    };

    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain("Database error");
  });
});
