import { Status, ServiceOrderStatus } from "../status";

describe("Status", () => {
  describe("create", () => {
    it("should create a valid Status from string", () => {
      const status = Status.create("CREATED");
      expect(status.toString()).toBe("CREATED");
    });

    it("should be case insensitive", () => {
      const status1 = Status.create("created");
      const status2 = Status.create("CREATED");
      expect(status1.equals(status2)).toBe(true);
    });

    it("should throw error for invalid status", () => {
      expect(() => Status.create("INVALID")).toThrow("Invalid status");
    });
  });

  describe("factory methods", () => {
    it("should create CREATED status", () => {
      const status = Status.created();
      expect(status.getValue()).toBe(ServiceOrderStatus.CREATED);
    });

    it("should create STARTED status", () => {
      const status = Status.started();
      expect(status.getValue()).toBe(ServiceOrderStatus.STARTED);
    });

    it("should create IN_PROGRESS status", () => {
      const status = Status.inProgress();
      expect(status.getValue()).toBe(ServiceOrderStatus.IN_PROGRESS);
    });

    it("should create COMPLETED status", () => {
      const status = Status.completed();
      expect(status.getValue()).toBe(ServiceOrderStatus.COMPLETED);
    });

    it("should create CANCELLED status", () => {
      const status = Status.cancelled();
      expect(status.getValue()).toBe(ServiceOrderStatus.CANCELLED);
    });
  });

  describe("canTransitionToStarted", () => {
    it("should return true for CREATED status", () => {
      const status = Status.created();
      expect(status.canTransitionToStarted()).toBe(true);
    });

    it("should return false for non-CREATED status", () => {
      const status = Status.started();
      expect(status.canTransitionToStarted()).toBe(false);
    });
  });

  describe("canTransitionToInProgress", () => {
    it("should return true for STARTED status", () => {
      const status = Status.started();
      expect(status.canTransitionToInProgress()).toBe(true);
    });

    it("should return true for PAUSED status", () => {
      const status = Status.create("PAUSED");
      expect(status.canTransitionToInProgress()).toBe(true);
    });

    it("should return false for CREATED status", () => {
      const status = Status.created();
      expect(status.canTransitionToInProgress()).toBe(false);
    });
  });

  describe("canTransitionToCompleted", () => {
    it("should return true for IN_PROGRESS status", () => {
      const status = Status.inProgress();
      expect(status.canTransitionToCompleted()).toBe(true);
    });

    it("should return true for STARTED status", () => {
      const status = Status.started();
      expect(status.canTransitionToCompleted()).toBe(true);
    });

    it("should return false for CREATED status", () => {
      const status = Status.created();
      expect(status.canTransitionToCompleted()).toBe(false);
    });
  });

  describe("canBeCancelled", () => {
    it("should return true for CREATED status", () => {
      const status = Status.created();
      expect(status.canBeCancelled()).toBe(true);
    });

    it("should return true for STARTED status", () => {
      const status = Status.started();
      expect(status.canBeCancelled()).toBe(true);
    });

    it("should return false for COMPLETED status", () => {
      const status = Status.completed();
      expect(status.canBeCancelled()).toBe(false);
    });
  });

  describe("isFinalized", () => {
    it("should return true for COMPLETED status", () => {
      const status = Status.completed();
      expect(status.isFinalized()).toBe(true);
    });

    it("should return true for CANCELLED status", () => {
      const status = Status.cancelled();
      expect(status.isFinalized()).toBe(true);
    });

    it("should return true for REJECTED status", () => {
      const status = Status.create("REJECTED");
      expect(status.isFinalized()).toBe(true);
    });

    it("should return false for CREATED status", () => {
      const status = Status.created();
      expect(status.isFinalized()).toBe(false);
    });
  });
});
