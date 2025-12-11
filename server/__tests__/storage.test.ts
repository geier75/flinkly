import { describe, it, expect } from 'vitest';

/**
 * Storage Service Tests
 * 
 * Tests for file upload and storage handling
 */

describe('Storage Service', () => {
  describe('File Validation', () => {
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const validateFile = (file: { type: string; size: number; name: string }) => {
      const errors: string[] = [];
      
      const allAllowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
      if (!allAllowedTypes.includes(file.type)) {
        errors.push('Ungültiger Dateityp');
      }
      
      if (file.size > MAX_FILE_SIZE) {
        errors.push('Datei zu groß (max. 10MB)');
      }
      
      if (!file.name || file.name.length === 0) {
        errors.push('Dateiname fehlt');
      }
      
      return {
        valid: errors.length === 0,
        errors,
      };
    };

    it('should accept valid image types', () => {
      ALLOWED_IMAGE_TYPES.forEach(type => {
        const result = validateFile({ type, size: 1024, name: 'test.jpg' });
        expect(result.valid).toBe(true);
      });
    });

    it('should accept valid document types', () => {
      ALLOWED_DOCUMENT_TYPES.forEach(type => {
        const result = validateFile({ type, size: 1024, name: 'test.pdf' });
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid file types', () => {
      const result = validateFile({ type: 'application/exe', size: 1024, name: 'virus.exe' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Ungültiger Dateityp');
    });

    it('should reject files over 10MB', () => {
      const result = validateFile({ type: 'image/jpeg', size: 15 * 1024 * 1024, name: 'large.jpg' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Datei zu groß (max. 10MB)');
    });

    it('should reject files without name', () => {
      const result = validateFile({ type: 'image/jpeg', size: 1024, name: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Dateiname fehlt');
    });

    it('should accept file at exactly 10MB', () => {
      const result = validateFile({ type: 'image/jpeg', size: MAX_FILE_SIZE, name: 'exact.jpg' });
      expect(result.valid).toBe(true);
    });
  });

  describe('File Path Generation', () => {
    const generateFilePath = (userId: number, fileName: string, folder: string = 'uploads') => {
      const timestamp = Date.now();
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      return `${folder}/${userId}/${timestamp}_${sanitizedName}`;
    };

    it('should include user ID in path', () => {
      const path = generateFilePath(123, 'test.jpg');
      expect(path).toContain('/123/');
    });

    it('should sanitize file names', () => {
      const path = generateFilePath(1, 'my file (1).jpg');
      expect(path).not.toContain(' ');
      expect(path).not.toContain('(');
      expect(path).not.toContain(')');
    });

    it('should use custom folder', () => {
      const path = generateFilePath(1, 'test.jpg', 'avatars');
      expect(path.startsWith('avatars/')).toBe(true);
    });

    it('should include timestamp for uniqueness', async () => {
      const path1 = generateFilePath(1, 'test.jpg');
      await new Promise(resolve => setTimeout(resolve, 2)); // Wait 2ms
      const path2 = generateFilePath(1, 'test.jpg');
      // Paths should be different due to timestamp
      expect(path1).not.toBe(path2);
    });
  });

  describe('Image Processing', () => {
    const getImageDimensions = (width: number, height: number, maxSize: number = 1200) => {
      if (width <= maxSize && height <= maxSize) {
        return { width, height };
      }
      
      const ratio = Math.min(maxSize / width, maxSize / height);
      return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio),
      };
    };

    it('should not resize small images', () => {
      const result = getImageDimensions(800, 600);
      expect(result).toEqual({ width: 800, height: 600 });
    });

    it('should resize large images maintaining aspect ratio', () => {
      const result = getImageDimensions(2400, 1800);
      expect(result.width).toBe(1200);
      expect(result.height).toBe(900);
    });

    it('should handle portrait images', () => {
      const result = getImageDimensions(1800, 2400);
      expect(result.width).toBe(900);
      expect(result.height).toBe(1200);
    });

    it('should handle square images', () => {
      const result = getImageDimensions(2000, 2000);
      expect(result.width).toBe(1200);
      expect(result.height).toBe(1200);
    });
  });

  describe('Thumbnail Generation', () => {
    const getThumbnailSize = (width: number, height: number, targetSize: number = 300) => {
      const ratio = Math.min(targetSize / width, targetSize / height);
      return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio),
      };
    };

    it('should generate 300px thumbnails', () => {
      const result = getThumbnailSize(1200, 800);
      expect(result.width).toBeLessThanOrEqual(300);
      expect(result.height).toBeLessThanOrEqual(300);
    });

    it('should maintain aspect ratio', () => {
      const original = { width: 1200, height: 800 };
      const thumb = getThumbnailSize(original.width, original.height);
      const originalRatio = original.width / original.height;
      const thumbRatio = thumb.width / thumb.height;
      expect(Math.abs(originalRatio - thumbRatio)).toBeLessThan(0.01);
    });
  });

  describe('URL Generation', () => {
    const STORAGE_BASE_URL = 'https://storage.flinkly.com';

    const getPublicUrl = (path: string) => `${STORAGE_BASE_URL}/${path}`;
    
    const getSignedUrl = (path: string, expiresIn: number = 3600) => {
      const expires = Date.now() + expiresIn * 1000;
      return `${STORAGE_BASE_URL}/${path}?expires=${expires}&signature=mock`;
    };

    it('should generate public URLs', () => {
      const url = getPublicUrl('uploads/123/image.jpg');
      expect(url).toBe('https://storage.flinkly.com/uploads/123/image.jpg');
    });

    it('should generate signed URLs with expiration', () => {
      const url = getSignedUrl('private/123/document.pdf', 3600);
      expect(url).toContain('expires=');
      expect(url).toContain('signature=');
    });
  });

  describe('File Extension Handling', () => {
    const getExtension = (fileName: string) => {
      const parts = fileName.split('.');
      return parts.length > 1 ? parts.pop()?.toLowerCase() : '';
    };

    const getMimeType = (extension: string) => {
      const mimeTypes: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
      return mimeTypes[extension] || 'application/octet-stream';
    };

    it('should extract file extension', () => {
      expect(getExtension('image.jpg')).toBe('jpg');
      expect(getExtension('document.pdf')).toBe('pdf');
      expect(getExtension('file.name.with.dots.png')).toBe('png');
    });

    it('should handle files without extension', () => {
      expect(getExtension('noextension')).toBe('');
    });

    it('should get correct MIME type', () => {
      expect(getMimeType('jpg')).toBe('image/jpeg');
      expect(getMimeType('png')).toBe('image/png');
      expect(getMimeType('pdf')).toBe('application/pdf');
    });

    it('should return octet-stream for unknown types', () => {
      expect(getMimeType('xyz')).toBe('application/octet-stream');
    });
  });

  describe('Storage Quota', () => {
    const MAX_STORAGE_PER_USER = 100 * 1024 * 1024; // 100MB

    const checkStorageQuota = (currentUsage: number, newFileSize: number) => {
      const totalAfterUpload = currentUsage + newFileSize;
      return {
        allowed: totalAfterUpload <= MAX_STORAGE_PER_USER,
        currentUsage,
        remaining: Math.max(0, MAX_STORAGE_PER_USER - currentUsage),
        wouldExceedBy: Math.max(0, totalAfterUpload - MAX_STORAGE_PER_USER),
      };
    };

    it('should allow upload within quota', () => {
      const result = checkStorageQuota(50 * 1024 * 1024, 10 * 1024 * 1024);
      expect(result.allowed).toBe(true);
    });

    it('should reject upload exceeding quota', () => {
      const result = checkStorageQuota(95 * 1024 * 1024, 10 * 1024 * 1024);
      expect(result.allowed).toBe(false);
      expect(result.wouldExceedBy).toBe(5 * 1024 * 1024);
    });

    it('should calculate remaining space', () => {
      const result = checkStorageQuota(60 * 1024 * 1024, 0);
      expect(result.remaining).toBe(40 * 1024 * 1024);
    });
  });

  describe('File Cleanup', () => {
    const isExpired = (uploadDate: Date, maxAgeDays: number = 30) => {
      const now = new Date();
      const ageMs = now.getTime() - uploadDate.getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      return ageDays > maxAgeDays;
    };

    it('should identify expired files', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 60);
      expect(isExpired(oldDate)).toBe(true);
    });

    it('should not mark recent files as expired', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 10);
      expect(isExpired(recentDate)).toBe(false);
    });

    it('should respect custom max age', () => {
      const date = new Date();
      date.setDate(date.getDate() - 10);
      expect(isExpired(date, 7)).toBe(true);
      expect(isExpired(date, 14)).toBe(false);
    });
  });
});
