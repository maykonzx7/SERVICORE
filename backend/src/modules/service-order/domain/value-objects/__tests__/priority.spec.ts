import { Priority, PriorityLevel } from "../priority";

describe("Priority", () => {
  describe("create", () => {
    it("should create a valid Priority from string", () => {
      const priority = Priority.create("HIGH");
      expect(priority.toString()).toBe("HIGH");
    });

    it("should be case insensitive", () => {
      const priority1 = Priority.create("high");
      const priority2 = Priority.create("HIGH");
      expect(priority1.equals(priority2)).toBe(true);
    });

    it("should throw error for invalid priority", () => {
      expect(() => Priority.create("INVALID")).toThrow(
        "Invalid priority level"
      );
    });
  });

  describe("factory methods", () => {
    it("should create LOW priority", () => {
      const priority = Priority.low();
      expect(priority.getValue()).toBe(PriorityLevel.LOW);
    });

    it("should create MEDIUM priority", () => {
      const priority = Priority.medium();
      expect(priority.getValue()).toBe(PriorityLevel.MEDIUM);
    });

    it("should create HIGH priority", () => {
      const priority = Priority.high();
      expect(priority.getValue()).toBe(PriorityLevel.HIGH);
    });

    it("should create CRITICAL priority", () => {
      const priority = Priority.critical();
      expect(priority.getValue()).toBe(PriorityLevel.CRITICAL);
    });
  });

  describe("isCritical", () => {
    it("should return true for CRITICAL priority", () => {
      const priority = Priority.critical();
      expect(priority.isCritical()).toBe(true);
    });

    it("should return false for non-critical priority", () => {
      const priority = Priority.high();
      expect(priority.isCritical()).toBe(false);
    });
  });

  describe("isHighOrCritical", () => {
    it("should return true for HIGH priority", () => {
      const priority = Priority.high();
      expect(priority.isHighOrCritical()).toBe(true);
    });

    it("should return true for CRITICAL priority", () => {
      const priority = Priority.critical();
      expect(priority.isHighOrCritical()).toBe(true);
    });

    it("should return false for LOW priority", () => {
      const priority = Priority.low();
      expect(priority.isHighOrCritical()).toBe(false);
    });
  });
});
