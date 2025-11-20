import { describe, it, expect } from "vitest";
import { calculatePopularityScore } from "../services/popularityService";

describe("Popularity Score Calculation", () => {
  it("should calculate score correctly with all metrics", () => {
    const score = calculatePopularityScore({
      gigId: 1,
      views: 100,
      orders: 50,
      rating: 450, // 4.5 stars on 0-500 scale
    });
    
    // Expected: (100 * 0.3) + (50 * 0.5) + (4.5 * 0.2) = 30 + 25 + 0.9 = 55.9 → 56
    expect(score).toBe(56);
  });

  it("should handle zero views", () => {
    const score = calculatePopularityScore({
      gigId: 1,
      views: 0,
      orders: 10,
      rating: 500,
    });
    
    // Expected: (0 * 0.3) + (10 * 0.5) + (5.0 * 0.2) = 0 + 5 + 1.0 = 6
    expect(score).toBe(6);
  });

  it("should handle zero orders", () => {
    const score = calculatePopularityScore({
      gigId: 1,
      views: 200,
      orders: 0,
      rating: 400,
    });
    
    // Expected: (200 * 0.3) + (0 * 0.5) + (4.0 * 0.2) = 60 + 0 + 0.8 = 60.8 → 61
    expect(score).toBe(61);
  });

  it("should handle zero rating", () => {
    const score = calculatePopularityScore({
      gigId: 1,
      views: 50,
      orders: 20,
      rating: 0,
    });
    
    // Expected: (50 * 0.3) + (20 * 0.5) + (0 * 0.2) = 15 + 10 + 0 = 25
    expect(score).toBe(25);
  });

  it("should handle all zeros", () => {
    const score = calculatePopularityScore({
      gigId: 1,
      views: 0,
      orders: 0,
      rating: 0,
    });
    
    expect(score).toBe(0);
  });

  it("should handle high values", () => {
    const score = calculatePopularityScore({
      gigId: 1,
      views: 10000,
      orders: 500,
      rating: 500,
    });
    
    // Expected: (10000 * 0.3) + (500 * 0.5) + (5.0 * 0.2) = 3000 + 250 + 1.0 = 3251
    expect(score).toBe(3251);
  });

  it("should weight orders highest (50%)", () => {
    const scoreHighOrders = calculatePopularityScore({
      gigId: 1,
      views: 100,
      orders: 100,
      rating: 300,
    });
    
    const scoreHighViews = calculatePopularityScore({
      gigId: 2,
      views: 200,
      orders: 50,
      rating: 300,
    });
    
    // High orders should score higher due to 50% weight
    // scoreHighOrders: (100 * 0.3) + (100 * 0.5) + (3.0 * 0.2) = 30 + 50 + 0.6 = 80.6 → 81
    // scoreHighViews: (200 * 0.3) + (50 * 0.5) + (3.0 * 0.2) = 60 + 25 + 0.6 = 85.6 → 86
    
    expect(scoreHighOrders).toBe(81);
    expect(scoreHighViews).toBe(86);
  });

  it("should normalize rating from 0-500 scale to 0-5 scale", () => {
    const score500 = calculatePopularityScore({
      gigId: 1,
      views: 0,
      orders: 0,
      rating: 500, // 5.0 stars
    });
    
    const score250 = calculatePopularityScore({
      gigId: 2,
      views: 0,
      orders: 0,
      rating: 250, // 2.5 stars
    });
    
    // score500: (0 * 0.3) + (0 * 0.5) + (5.0 * 0.2) = 1.0
    // score250: (0 * 0.3) + (0 * 0.5) + (2.5 * 0.2) = 0.5
    
    expect(score500).toBe(1);
    expect(score250).toBe(1); // Rounds 0.5 to 1
  });

  it("should round to nearest integer", () => {
    const scoreRoundDown = calculatePopularityScore({
      gigId: 1,
      views: 10,
      orders: 10,
      rating: 100,
    });
    
    const scoreRoundUp = calculatePopularityScore({
      gigId: 2,
      views: 10,
      orders: 10,
      rating: 300,
    });
    
    // scoreRoundDown: (10 * 0.3) + (10 * 0.5) + (1.0 * 0.2) = 3 + 5 + 0.2 = 8.2 → 8
    // scoreRoundUp: (10 * 0.3) + (10 * 0.5) + (3.0 * 0.2) = 3 + 5 + 0.6 = 8.6 → 9
    
    expect(scoreRoundDown).toBe(8);
    expect(scoreRoundUp).toBe(9);
  });
});
