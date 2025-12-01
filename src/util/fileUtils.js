// Maximum file upload size in bytes (50 MB)
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 52,428,800 bytes
export const MAX_FILE_SIZE_MB = 50;

/**
 * Validates if a file size is within the allowed limit
 * @param {number} sizeInBytes - File size in bytes
 * @returns {boolean} True if valid, false otherwise
 */
export const isFileSizeValid = (sizeInBytes) => {
  return sizeInBytes <= MAX_FILE_SIZE_BYTES;
};

/**
 * Formats bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted size string (e.g., "45.5 MB")
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = Number.parseFloat((bytes / (k ** i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
};

/**
 * Creates a detailed error message for file size validation
 * @param {number} actualSizeBytes - Actual file size in bytes
 * @param {number} maxSizeBytes - Maximum allowed size in bytes
 * @returns {object} Error details with formatted message
 */
export const createFileSizeErrorDetails = (
  actualSizeBytes,
  maxSizeBytes = MAX_FILE_SIZE_BYTES
) => {
  return {
    actualSize: formatBytes(actualSizeBytes),
    maxSize: formatBytes(maxSizeBytes),
    actualSizeBytes,
    maxSizeBytes,
  };
};
