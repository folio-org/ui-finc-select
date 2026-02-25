import {
  createFileSizeErrorDetails,
  formatBytes,
  isFileSizeValid,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from './fileUtils';

describe('fileUtils', () => {
  describe('constants', () => {
    it('should have correct MAX_FILE_SIZE_BYTES', () => {
      expect(MAX_FILE_SIZE_BYTES).toBe(52428800); // 50 * 1024 * 1024
    });

    it('should have correct MAX_FILE_SIZE_MB', () => {
      expect(MAX_FILE_SIZE_MB).toBe(50);
    });
  });

  describe('isFileSizeValid', () => {
    it('should accept file exactly at limit', () => {
      expect(isFileSizeValid(MAX_FILE_SIZE_BYTES)).toBe(true);
    });

    it('should accept file under limit', () => {
      expect(isFileSizeValid(MAX_FILE_SIZE_BYTES - 1)).toBe(true);
      expect(isFileSizeValid(1024)).toBe(true);
      expect(isFileSizeValid(1)).toBe(true);
    });

    it('should reject file over limit', () => {
      expect(isFileSizeValid(MAX_FILE_SIZE_BYTES + 1)).toBe(false);
      expect(isFileSizeValid(100 * 1024 * 1024)).toBe(false);
    });

    it('should handle zero size', () => {
      expect(isFileSizeValid(0)).toBe(true);
    });
  });

  describe('formatBytes', () => {
    it('should format zero bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('should format bytes correctly', () => {
      expect(formatBytes(100)).toBe('100 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(MAX_FILE_SIZE_BYTES)).toBe('50 MB');
    });

    it('should format with custom decimals', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB');
      expect(formatBytes(1536, 3)).toBe('1.5 KB');
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
      expect(formatBytes(1536000, 3)).toBe('1.465 MB');
    });

    it('should handle large files', () => {
      expect(formatBytes(1073741824)).toBe('1 GB');
      expect(formatBytes(1073741824 * 2)).toBe('2 GB');
    });

    it('should handle fractional MB', () => {
      expect(formatBytes(1572864)).toBe('1.5 MB');
    });
  });

  describe('createFileSizeErrorDetails', () => {
    it('should create error details with formatted sizes', () => {
      const details = createFileSizeErrorDetails(100 * 1024 * 1024);
      expect(details.actualSize).toBe('100 MB');
      expect(details.maxSize).toBe('50 MB');
      expect(details.actualSizeBytes).toBe(104857600);
      expect(details.maxSizeBytes).toBe(MAX_FILE_SIZE_BYTES);
    });

    it('should create error details for small files', () => {
      const details = createFileSizeErrorDetails(1024);
      expect(details.actualSize).toBe('1 KB');
      expect(details.maxSize).toBe('50 MB');
      expect(details.actualSizeBytes).toBe(1024);
      expect(details.maxSizeBytes).toBe(MAX_FILE_SIZE_BYTES);
    });

    it('should handle custom max size', () => {
      const customMax = 10 * 1024 * 1024; // 10 MB
      const details = createFileSizeErrorDetails(15 * 1024 * 1024, customMax);
      expect(details.actualSize).toBe('15 MB');
      expect(details.maxSize).toBe('10 MB');
      expect(details.actualSizeBytes).toBe(15728640);
      expect(details.maxSizeBytes).toBe(customMax);
    });

    it('should handle zero size', () => {
      const details = createFileSizeErrorDetails(0);
      expect(details.actualSize).toBe('0 Bytes');
      expect(details.maxSize).toBe('50 MB');
    });
  });
});
