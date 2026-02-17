import { StartServiceOrderUseCase } from "../start-service-order.usecase";
import { ServiceOrderRepository } from "../../../domain/repositories/service-order.repository";
import { ServiceOrder } from "../../../domain/entities/service-order";
import { CompanyId } from "../../../domain/value-objects/company-id";
import { Priority } from "../../../domain/value-objects/priority";
import { Money } from "../../../domain/value-objects/money";

describe("StartServiceOrderUseCase", () => {
  let useCase: StartServiceOrderUseCase;
  let mockRepository: jest.Mocked<ServiceOrderRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByCompanyId: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new StartServiceOrderUseCase(mockRepository);
  });

  it("should start a service order successfully", async () => {
    // Arrange
    const order = ServiceOrder.create(
      CompanyId.create("company-1"),
      "Test order",
      Priority.high(),
      Money.create(100)
    );

    mockRepository.findById.mockResolvedValue(order);

    // Act
    const result = await useCase.execute({
      serviceOrderId: order.getId().toString(),
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockRepository.findById).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.value?.status.getValue()).toBe("STARTED");
  });

  it("should return failure if order not found", async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);

    // Act
    const result = await useCase.execute({
      serviceOrderId: "non-existent-id",
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe("Service order not found");
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("should return failure if order cannot be started", async () => {
    // Arrange
    const order = ServiceOrder.create(
      CompanyId.create("company-1"),
      "Test order",
      Priority.high(),
      Money.create(100)
    );
    order.start(); // Já iniciada

    mockRepository.findById.mockResolvedValue(order);

    // Act
    const result = await useCase.execute({
      serviceOrderId: order.getId().toString(),
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain("can only be started if status is CREATED");
  });
});
