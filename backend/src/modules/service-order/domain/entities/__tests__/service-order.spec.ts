import { ServiceOrder } from "../service-order";
import { CompanyId } from "../../value-objects/company-id";
import { Priority } from "../../value-objects/priority";
import { Money } from "../../value-objects/money";

describe("ServiceOrder", () => {
  describe("create", () => {
    it("should create a new service order", () => {
      const companyId = CompanyId.create("company-1");
      const priority = Priority.high();
      const value = Money.create(100.5);

      const order = ServiceOrder.create(
        companyId,
        "Test description",
        priority,
        value
      );

      expect(order).toBeDefined();
      expect(order.description).toBe("Test description");
      expect(order.priority.equals(priority)).toBe(true);
      expect(order.value.equals(value)).toBe(true);
      expect(order.status.getValue()).toBe("CREATED");
      expect(order.hasDomainEvents()).toBe(true);
    });

    it("should throw error for empty description", () => {
      const companyId = CompanyId.create("company-1");
      const priority = Priority.medium();
      const value = Money.create(100);

      expect(() => ServiceOrder.create(companyId, "", priority, value)).toThrow(
        "Service order description cannot be empty"
      );
    });

    it("should publish ServiceOrderCreatedEvent", () => {
      const companyId = CompanyId.create("company-1");
      const priority = Priority.high();
      const value = Money.create(100);

      const order = ServiceOrder.create(companyId, "Test", priority, value);

      const events = order.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0].eventName).toBe("ServiceOrderCreated");
    });
  });

  describe("start", () => {
    it("should start a created service order", () => {
      const order = createServiceOrder();

      order.start();

      expect(order.status.getValue()).toBe("STARTED");
      expect(order.hasDomainEvents()).toBe(true);
    });

    it("should throw error if order is not in CREATED status", () => {
      const order = createServiceOrder();
      order.start();

      expect(() => order.start()).toThrow(
        "Service order can only be started if status is CREATED"
      );
    });

    it("should publish ServiceOrderStartedEvent", () => {
      const order = createServiceOrder();

      order.start();

      const events = order.domainEvents;
      const startedEvent = events.find(
        (e) => e.eventName === "ServiceOrderStarted"
      );
      expect(startedEvent).toBeDefined();
    });
  });

  describe("complete", () => {
    it("should complete an in-progress service order", () => {
      const order = createServiceOrder();
      order.start();
      order.markAsInProgress();

      order.complete();

      expect(order.status.getValue()).toBe("COMPLETED");
      expect(order.hasDomainEvents()).toBe(true);
    });

    it("should throw error if order cannot be completed", () => {
      const order = createServiceOrder();

      expect(() => order.complete()).toThrow(
        "Service order can only be completed if status is IN_PROGRESS or STARTED"
      );
    });
  });

  describe("cancel", () => {
    it("should cancel a created service order", () => {
      const order = createServiceOrder();

      order.cancel();

      expect(order.status.getValue()).toBe("CANCELLED");
    });

    it("should cancel a started service order", () => {
      const order = createServiceOrder();
      order.start();

      order.cancel();

      expect(order.status.getValue()).toBe("CANCELLED");
    });

    it("should throw error if order cannot be cancelled", () => {
      const order = createServiceOrder();
      order.start();
      order.markAsInProgress();
      order.complete();

      expect(() => order.cancel()).toThrow(
        "Service order can only be cancelled if status is CREATED or STARTED"
      );
    });
  });

  describe("updateDescription", () => {
    it("should update description of non-finalized order", () => {
      const order = createServiceOrder();

      order.updateDescription("New description");

      expect(order.description).toBe("New description");
    });

    it("should throw error if order is finalized", () => {
      const order = createServiceOrder();
      order.start();
      order.markAsInProgress();
      order.complete();

      expect(() => order.updateDescription("New")).toThrow(
        "Cannot update description of a finalized service order"
      );
    });
  });

  describe("updatePriority", () => {
    it("should update priority of non-finalized order", () => {
      const order = createServiceOrder();
      const newPriority = Priority.critical();

      order.updatePriority(newPriority);

      expect(order.priority.equals(newPriority)).toBe(true);
    });

    it("should throw error if order is finalized", () => {
      const order = createServiceOrder();
      order.start();
      order.complete();

      expect(() => order.updatePriority(Priority.critical())).toThrow(
        "Cannot update priority of a finalized service order"
      );
    });
  });

  describe("updateValue", () => {
    it("should update value of non-finalized order", () => {
      const order = createServiceOrder();
      const newValue = Money.create(200);

      order.updateValue(newValue);

      expect(order.value.equals(newValue)).toBe(true);
    });

    it("should throw error if order is finalized", () => {
      const order = createServiceOrder();
      order.start();
      order.complete();

      expect(() => order.updateValue(Money.create(200))).toThrow(
        "Cannot update value of a finalized service order"
      );
    });
  });
});

// Helper function
function createServiceOrder(): ServiceOrder {
  return ServiceOrder.create(
    CompanyId.create("company-1"),
    "Test description",
    Priority.medium(),
    Money.create(100)
  );
}
