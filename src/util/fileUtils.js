/**
 * File upload size limits
 *
 * 50 MB limit chosen based on current usage patterns:
 * - Largest files currently uploaded are ~22 MB
 * - Typical file sizes are under 30 MB
 * - 50 MB provides safe upper boundary while preventing abuse
 */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 52,428,800 bytes
export const MAX_FILE_SIZE_MB = 50;

// HTTP status code for payload too large error
export const HTTP_STATUS_PAYLOAD_TOO_LARGE = 413;

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

  const base = 1024;
  const decimalPlaces = Math.max(0, decimals);
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

  const value = Number((bytes / base ** unitIndex).toFixed(decimalPlaces));

  return `${value} ${units[unitIndex]}`;
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
