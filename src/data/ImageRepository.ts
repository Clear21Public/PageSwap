/**
 * ImageRepository - Gateway for fetching static image assets
 *
 * Simulates network latency and provides caching for image resources.
 * All images are fetched as Blobs and converted to Object URLs for use in <img> tags.
 */

export class ImageRepository {
    private static basePath = '/src/assets';
    private static minDelay = 500; // minimum delay in ms
    private static maxDelay = 3500; // maximum delay in ms

    /**
     * Simulate network delay with random "fuzzy" timing
     * Mimics slow connections, large file downloads, etc.
     */
    private static async simulateNetworkDelay(): Promise<void> {
        const delay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Fetch an image by ID and return a blob URL
     *
     * @param id - The image file ID (without extension)
     * @returns Promise resolving to a blob URL that can be used in <img src="">
     */
    static async get(id: string): Promise<string> {
        await this.simulateNetworkDelay();
        const extension = id === 'placeholder-dp' ? '.png' : '.jpg';
        const response = await fetch(`${this.basePath}/${id}${extension}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();

        return URL.createObjectURL(blob);
    }

    /**
     * Preload multiple images in parallel
     * Useful for loading all avatars at application start
     *
     * @param ids - Array of image IDs to preload
     * @returns Promise resolving to a map of id -> blob URL
     */
    static async preloadImages(ids: string[]): Promise<Map<string, string>> {
        const results = new Map<string, string>();

        await Promise.all(
            ids.map(async (id) => {
                try {
                    const url = await this.get(id);
                    results.set(id, url);
                } catch (error) {
                    console.error(`Failed to preload image ${id}:`, error);
                }
            })
        );

        return results;
    }
}
