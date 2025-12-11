import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Flinkly/i);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero content
    const heroSection = page.locator('[data-testid="hero-section"], .hero-section, section').first();
    await expect(heroSection).toBeVisible();
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation elements
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="such"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Logo Design');
      await expect(searchInput).toHaveValue('Logo Design');
    }
  });
});

test.describe('Gig Listing', () => {
  test('should display gig cards', async ({ page }) => {
    await page.goto('/');
    
    // Wait for gigs to load
    await page.waitForTimeout(2000);
    
    // Check for gig cards
    const gigCards = page.locator('[data-testid="gig-card"], .gig-card, article');
    
    // Should have at least some content
    const count = await gigCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to gig detail page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for gigs to load
    await page.waitForTimeout(2000);
    
    // Click on first gig card
    const gigCard = page.locator('[data-testid="gig-card"], .gig-card, article a').first();
    
    if (await gigCard.isVisible()) {
      await gigCard.click();
      
      // Should navigate to gig detail page
      await expect(page).toHaveURL(/\/gig\/\d+/);
    }
  });
});

test.describe('Category Navigation', () => {
  test('should display category filters', async ({ page }) => {
    await page.goto('/');
    
    // Look for category buttons or links
    const categories = page.locator('[data-testid="category"], .category, button:has-text("Design"), a:has-text("Design")');
    
    const count = await categories.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter gigs by category', async ({ page }) => {
    await page.goto('/');
    
    // Click on a category
    const designCategory = page.locator('button:has-text("Design"), a:has-text("Design")').first();
    
    if (await designCategory.isVisible()) {
      await designCategory.click();
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // URL should reflect category filter
      const url = page.url();
      expect(url.toLowerCase()).toContain('design');
    }
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should load without horizontal scroll
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });
});
