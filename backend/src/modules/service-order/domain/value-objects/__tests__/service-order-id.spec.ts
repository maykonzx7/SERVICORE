import { ServiceOrderId } from "../service-order-id";

describe("ServiceOrderId", () => {
  describe("create", () => {
    it("should create a valid ServiceOrderId", () => {
      const id = ServiceOrderId.create("valid-id-123");
      expect(id.toString()).toBe("valid-id-123");
    });

    it("should throw error for empty id", () => {
      expect(() => ServiceOrderId.create("")).toThrow(
        "ServiceOrderId cannot be empty"
      );
    });

    it("should throw error for whitespace-only id", () => {
      expect(() => ServiceOrderId.create("   ")).toThrow(
        "ServiceOrderId cannot be empty"
      );
    });
  });

  describe("generate", () => {
    it("should generate a new ServiceOrderId", () => {
      const id = ServiceOrderId.generate();
      expect(id.toString()).toBeTruthy();
      expect(id.toString().length).toBeGreaterThan(0);
    });

    it("should generate unique IDs", () => {
      const id1 = ServiceOrderId.generate();
      const id2 = ServiceOrderId.generate();
      expect(id1.toString()).not.toBe(id2.toString());
    });
  });

  describe("equals", () => {
    it("should return true for equal IDs", () => {
      const id1 = ServiceOrderId.create("same-id");
      const id2 = ServiceOrderId.create("same-id");
      expect(id1.equals(id2)).toBe(true);
    });

    it("should return false for different IDs", () => {
      const id1 = ServiceOrderId.create("id-1");
      const id2 = ServiceOrderId.create("id-2");
      expect(id1.equals(id2)).toBe(false);
    });

    it("should return false for null", () => {
      const id = ServiceOrderId.create("id-1");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(id.equals(null as any)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return the ID as string", () => {
      const id = ServiceOrderId.create("test-id");
      expect(id.toString()).toBe("test-id");
    });
  });
});
