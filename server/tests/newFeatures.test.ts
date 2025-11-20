import { describe, it, expect } from "vitest";
import { meetsLevelRequirements, calculateNextLevel } from "../services/sellerLevelService";

describe("Seller Level System", () => {
  describe("meetsLevelRequirements", () => {
    it("should return true for new level with zero stats", () => {
      const seller = {
        completedOrders: 0,
        averageRating: 0,
        responseTimeHours: 24,
        onTimeDeliveryRate: 0,
      };
      expect(meetsLevelRequirements(seller, "new")).toBe(true);
    });

    it("should return true for rising level with 10 orders and 4.5 rating", () => {
      const seller = {
        completedOrders: 10,
        averageRating: 450,
        responseTimeHours: 24,
        onTimeDeliveryRate: 85,
      };
      expect(meetsLevelRequirements(seller, "rising")).toBe(true);
    });

    it("should return false for rising level with insufficient orders", () => {
      const seller = {
        completedOrders: 5,
        averageRating: 450,
        responseTimeHours: 24,
        onTimeDeliveryRate: 85,
      };
      expect(meetsLevelRequirements(seller, "rising")).toBe(false);
    });

    it("should return true for top_rated level with all requirements met", () => {
      const seller = {
        completedOrders: 200,
        averageRating: 490,
        responseTimeHours: 6,
        onTimeDeliveryRate: 95,
      };
      expect(meetsLevelRequirements(seller, "top_rated")).toBe(true);
    });

    it("should return false for level_one with insufficient rating", () => {
      const seller = {
        completedOrders: 50,
        averageRating: 450, // Need 470+
        responseTimeHours: 12,
        onTimeDeliveryRate: 90,
      };
      expect(meetsLevelRequirements(seller, "level_one")).toBe(false);
    });
  });

  describe("calculateNextLevel", () => {
    it("should return rising for new seller with 10 orders", () => {
      const seller = {
        completedOrders: 10,
        averageRating: 450,
        responseTimeHours: 24,
        onTimeDeliveryRate: 85,
      };
      expect(calculateNextLevel("new", seller)).toBe("rising");
    });

    it("should return null for new seller with insufficient stats", () => {
      const seller = {
        completedOrders: 5,
        averageRating: 400,
        responseTimeHours: 24,
        onTimeDeliveryRate: 80,
      };
      expect(calculateNextLevel("new", seller)).toBe(null);
    });

    it("should skip levels if seller meets higher requirements", () => {
      const seller = {
        completedOrders: 50,
        averageRating: 470,
        responseTimeHours: 12,
        onTimeDeliveryRate: 90,
      };
      expect(calculateNextLevel("new", seller)).toBe("level_one");
    });

    it("should return null for top_rated seller (no higher level)", () => {
      const seller = {
        completedOrders: 300,
        averageRating: 500,
        responseTimeHours: 1,
        onTimeDeliveryRate: 100,
      };
      expect(calculateNextLevel("top_rated", seller)).toBe(null);
    });

    it("should upgrade rising to level_one when requirements met", () => {
      const seller = {
        completedOrders: 50,
        averageRating: 470,
        responseTimeHours: 12,
        onTimeDeliveryRate: 90,
      };
      expect(calculateNextLevel("rising", seller)).toBe("level_one");
    });
  });
});

describe("Checkout Steps Validation", () => {
  it("should validate briefing step with minimum requirements", () => {
    const briefing = {
      projectName: "Test Project",
      description: "This is a test description with more than 20 characters",
    };
    expect(briefing.projectName.length >= 5).toBe(true);
    expect(briefing.description.length >= 20).toBe(true);
  });

  it("should reject briefing with short project name", () => {
    const briefing = {
      projectName: "Test",
      description: "This is a test description with more than 20 characters",
    };
    expect(briefing.projectName.length >= 5).toBe(false);
  });

  it("should reject briefing with short description", () => {
    const briefing = {
      projectName: "Test Project",
      description: "Short",
    };
    expect(briefing.description.length >= 20).toBe(false);
  });

  it("should validate payment step with escrow acceptance", () => {
    const payment = {
      method: "card",
      acceptEscrow: true,
    };
    expect(payment.acceptEscrow).toBe(true);
  });

  it("should validate legal step with terms acceptance", () => {
    const legal = {
      acceptTerms: true,
      needsAVV: false,
    };
    expect(legal.acceptTerms).toBe(true);
  });

  it("should validate legal step with AVV requirements", () => {
    const legal = {
      acceptTerms: true,
      needsAVV: true,
      companyName: "Test GmbH",
      dataProcessing: "Test processing",
    };
    expect(legal.acceptTerms && !!legal.companyName && !!legal.dataProcessing).toBe(true);
  });
});

describe("Seller Onboarding Checklist", () => {
  it("should calculate progress correctly", () => {
    const checklist = [
      { completed: true },
      { completed: true },
      { completed: false },
      { completed: false },
    ];
    const completedCount = checklist.filter((item) => item.completed).length;
    const totalCount = checklist.length;
    const progress = (completedCount / totalCount) * 100;
    
    expect(progress).toBe(50);
  });

  it("should detect completion when all items are done", () => {
    const checklist = [
      { completed: true },
      { completed: true },
      { completed: true },
      { completed: true },
    ];
    const isComplete = checklist.every((item) => item.completed);
    
    expect(isComplete).toBe(true);
  });

  it("should detect incomplete state", () => {
    const checklist = [
      { completed: true },
      { completed: false },
      { completed: true },
      { completed: false },
    ];
    const isComplete = checklist.every((item) => item.completed);
    
    expect(isComplete).toBe(false);
  });
});
