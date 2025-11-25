import type { IImageRepository } from './types.ts';

/**
 * LocalAssetImageRepository - Gateway for fetching static image assets
 *
 * Simulates network latency and provides caching for image resources.
 * All images are fetched as Blobs and converted to Object URLs for use in <img> tags.
 */

export class StaticAssetImageRepository implements IImageRepository {
  private basePath = '/assets';
  private minDelay = 500; // minimum delay in ms
  private maxDelay = 3500; // maximum delay in ms

  /**
   * Fetch an image by ID and return a blob URL
   *
   * @param resource - The image resource name (with extension .jpg, .png)
   * @returns Promise resolving to a blob URL that can be used in <img src="">
   */
  get = async (resource: string): Promise<string> => {
    await this.simulateNetworkDelay();
    const response = await fetch(`${this.basePath}/${resource}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Check if we actually got an image (not HTML from SPA fallback)
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`Image not found: ${resource}`);
    }

    const blob = await response.blob();

    return URL.createObjectURL(blob);
  }

  /**
   * Simulate network delay with random "fuzzy" timing
   * Mimics slow connections, large file downloads, etc.
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
