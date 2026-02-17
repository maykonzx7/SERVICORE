import { Money } from "../money";

describe("Money", () => {
  describe("create", () => {
    it("should create a valid Money", () => {
      const money = Money.create(100.5);
      expect(money.getAmount()).toBe(100.5);
      expect(money.getCurrency()).toBe("BRL");
    });

    it("should create Money with custom currency", () => {
      const money = Money.create(100, "USD");
      expect(money.getAmount()).toBe(100);
      expect(money.getCurrency()).toBe("USD");
    });

    it("should throw error for negative amount", () => {
      expect(() => Money.create(-10)).toThrow(
        "Money amount cannot be negative"
      );
    });

    it("should throw error for NaN", () => {
      expect(() => Money.create(NaN)).toThrow(
        "Money amount must be a valid number"
      );
    });

    it("should throw error for Infinity", () => {
      expect(() => Money.create(Infinity)).toThrow(
        "Money amount must be a valid number"
      );
    });
  });

  describe("zero", () => {
    it("should create Money with zero value", () => {
      const money = Money.zero();
      expect(money.getAmount()).toBe(0);
      expect(money.isZero()).toBe(true);
    });
  });

  describe("add", () => {
    it("should add two Money values", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      const result = money1.add(money2);
      expect(result.getAmount()).toBe(150);
    });

    it("should throw error for different currencies", () => {
      const money1 = Money.create(100, "BRL");
      const money2 = Money.create(50, "USD");
      expect(() => money1.add(money2)).toThrow(
        "Cannot add money with different currencies"
      );
    });
  });

  describe("subtract", () => {
    it("should subtract two Money values", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(30);
      const result = money1.subtract(money2);
      expect(result.getAmount()).toBe(70);
    });

    it("should throw error if result is negative", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);
      expect(() => money1.subtract(money2)).toThrow(
        "Money result cannot be negative"
      );
    });
  });

  describe("isZero", () => {
    it("should return true for zero value", () => {
      const money = Money.zero();
      expect(money.isZero()).toBe(true);
    });

    it("should return false for non-zero value", () => {
      const money = Money.create(100);
      expect(money.isZero()).toBe(false);
    });
  });
});
