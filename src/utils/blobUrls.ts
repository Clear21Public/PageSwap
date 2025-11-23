/**
 * Utility functions for managing blob URLs
 */

/**
 * Revokes all blob URLs in the provided record
 * @param urls - Record of blob URLs to revoke
 */
export function revokeBlobUrls(urls: Record<string, string>): void {
  Object.values(urls).forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}
