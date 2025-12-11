import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeText, sanitizeMessage } from '../sanitize';

/**
 * Sanitization Tests
 * 
 * Tests XSS prevention and HTML sanitization
 */

describe('Sanitization', () => {
  describe('sanitizeHTML', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHTML(input);
      expect(result).toBe('<p>Hello <strong>World</strong></p>');
    });

    it('should allow headings', () => {
      const input = '<h1>Title</h1><h2>Subtitle</h2>';
      const result = sanitizeHTML(input);
      expect(result).toContain('<h1>');
      expect(result).toContain('<h2>');
    });

    it('should allow lists', () => {
      const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitizeHTML(input);
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
    });

    it('should allow links with href', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizeHTML(input);
      expect(result).toContain('href="https://example.com"');
    });

    it('should allow code blocks', () => {
      const input = '<pre><code>const x = 1;</code></pre>';
      const result = sanitizeHTML(input);
      expect(result).toContain('<pre>');
      expect(result).toContain('<code>');
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("XSS")</script>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove onclick handlers', () => {
      const input = '<button onclick="alert(1)">Click</button>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onclick');
    });

    it('should remove onerror handlers', () => {
      const input = '<img src="x" onerror="alert(1)">';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onerror');
    });

    it('should remove javascript: URLs', () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('javascript:');
    });

    it('should remove data: URLs in links', () => {
      const input = '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('data:');
    });

    it('should remove iframe tags', () => {
      const input = '<iframe src="https://evil.com"></iframe>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<iframe');
    });

    it('should remove form tags', () => {
      const input = '<form action="https://evil.com"><input></form>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<form');
    });

    it('should remove style tags', () => {
      const input = '<style>body { display: none; }</style>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<style>');
    });

    it('should remove data attributes', () => {
      const input = '<div data-evil="payload">Content</div>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('data-evil');
    });

    it('should handle empty string', () => {
      expect(sanitizeHTML('')).toBe('');
    });

    it('should handle plain text', () => {
      const input = 'Just plain text';
      expect(sanitizeHTML(input)).toBe('Just plain text');
    });

    it('should handle special characters', () => {
      const input = '<p>Price: €50 &amp; more</p>';
      const result = sanitizeHTML(input);
      expect(result).toContain('€50');
    });
  });

  describe('sanitizeText', () => {
    it('should strip all HTML tags', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeText(input);
      expect(result).toBe('Hello World');
    });

    it('should remove all formatting', () => {
      const input = '<h1>Title</h1><ul><li>Item</li></ul>';
      const result = sanitizeText(input);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should remove script content', () => {
      const input = '<script>alert("XSS")</script>Hello';
      const result = sanitizeText(input);
      expect(result).not.toContain('alert');
      expect(result).toContain('Hello');
    });

    it('should handle empty string', () => {
      expect(sanitizeText('')).toBe('');
    });

    it('should preserve plain text', () => {
      const input = 'Just plain text with no HTML';
      expect(sanitizeText(input)).toBe('Just plain text with no HTML');
    });

    it('should handle nested tags', () => {
      const input = '<div><p><span>Nested</span></p></div>';
      const result = sanitizeText(input);
      expect(result).toBe('Nested');
    });
  });

  describe('sanitizeMessage', () => {
    it('should allow basic formatting', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeMessage(input);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });

    it('should allow emphasis', () => {
      const input = '<em>Italic text</em>';
      const result = sanitizeMessage(input);
      expect(result).toContain('<em>');
    });

    it('should allow line breaks', () => {
      const input = 'Line 1<br>Line 2';
      const result = sanitizeMessage(input);
      expect(result).toContain('<br');
    });

    it('should allow links', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizeMessage(input);
      expect(result).toContain('<a');
      expect(result).toContain('href');
    });

    it('should remove headings', () => {
      const input = '<h1>Title</h1>';
      const result = sanitizeMessage(input);
      expect(result).not.toContain('<h1>');
    });

    it('should remove lists', () => {
      const input = '<ul><li>Item</li></ul>';
      const result = sanitizeMessage(input);
      expect(result).not.toContain('<ul>');
      expect(result).not.toContain('<li>');
    });

    it('should remove code blocks', () => {
      const input = '<pre><code>code</code></pre>';
      const result = sanitizeMessage(input);
      expect(result).not.toContain('<pre>');
      expect(result).not.toContain('<code>');
    });

    it('should remove script tags', () => {
      const input = '<script>alert(1)</script>';
      const result = sanitizeMessage(input);
      expect(result).not.toContain('<script>');
    });

    it('should handle empty string', () => {
      expect(sanitizeMessage('')).toBe('');
    });
  });

  describe('XSS Attack Vectors', () => {
    const xssVectors = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1) autofocus>',
      '<marquee onstart=alert(1)>',
      '<video><source onerror=alert(1)>',
      '<audio src=x onerror=alert(1)>',
      '<iframe src="javascript:alert(1)">',
      '<object data="javascript:alert(1)">',
      '<embed src="javascript:alert(1)">',
      '<a href="javascript:alert(1)">click</a>',
      '<a href="data:text/html,<script>alert(1)</script>">click</a>',
      '<div style="background:url(javascript:alert(1))">',
      '<div style="behavior:url(xss.htc)">',
      '"><script>alert(1)</script>',
      "'-alert(1)-'",
      '<math><maction actiontype="statusline#http://evil.com">click</maction></math>',
    ];

    xssVectors.forEach((vector, index) => {
      it(`should neutralize XSS vector ${index + 1}`, () => {
        const resultHTML = sanitizeHTML(vector);
        const resultText = sanitizeText(vector);
        const resultMessage = sanitizeMessage(vector);

        // None should contain executable JavaScript
        expect(resultHTML).not.toMatch(/javascript:/i);
        expect(resultHTML).not.toMatch(/on\w+=/i);
        expect(resultHTML).not.toContain('<script');

        expect(resultText).not.toMatch(/javascript:/i);
        expect(resultText).not.toMatch(/on\w+=/i);

        expect(resultMessage).not.toMatch(/javascript:/i);
        expect(resultMessage).not.toMatch(/on\w+=/i);
        expect(resultMessage).not.toContain('<script');
      });
    });
  });
});
