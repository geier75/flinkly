import { describe, it, expect, beforeAll } from "vitest";
import { getGigsPaginated } from "../server/db_pagination";

describe("Cursor-based Pagination", () => {
  it("should return gigs without cursor", async () => {
    const result = await getGigsPaginated({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it("should filter by category", async () => {
    const result = await getGigsPaginated({
      limit: 10,
      category: "design",
    });

    expect(Array.isArray(result)).toBe(true);
    // All returned gigs should match the category
    result.forEach((gig) => {
      expect(gig.category).toBe("design");
    });
  });

  it("should filter by price range", async () => {
    const minPrice = 1000; // 10€
    const maxPrice = 5000; // 50€

    const result = await getGigsPaginated({
      limit: 10,
      minPrice,
      maxPrice,
    });

    expect(Array.isArray(result)).toBe(true);
    // All returned gigs should be within price range
    result.forEach((gig) => {
      expect(gig.price).toBeGreaterThanOrEqual(minPrice);
      expect(gig.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  it("should return gigs with seller info", async () => {
    const result = await getGigsPaginated({
      limit: 5,
    });

    if (result.length > 0) {
      const firstGig = result[0];
      expect(firstGig).toHaveProperty("seller");
      expect(firstGig.seller).toHaveProperty("id");
      expect(firstGig.seller).toHaveProperty("name");
      expect(firstGig.seller).toHaveProperty("sellerLevel");
    }
  });

  it("should use cursor for pagination", async () => {
    // Get first page
    const firstPage = await getGigsPaginated({
      limit: 5,
    });

    if (firstPage.length === 5) {
      // Get second page using cursor
      const cursor = firstPage[firstPage.length - 1].id;
      const secondPage = await getGigsPaginated({
        limit: 5,
        cursor,
      });

      // Second page should not contain any gigs from first page
      const firstPageIds = firstPage.map((g) => g.id);
      secondPage.forEach((gig) => {
        expect(firstPageIds).not.toContain(gig.id);
      });
    }
  });

  it("should only return active and published gigs", async () => {
    const result = await getGigsPaginated({
      limit: 20,
    });

    result.forEach((gig) => {
      expect(gig.active).toBe(true);
      expect(gig.status).toBe("published");
    });
  });
});
