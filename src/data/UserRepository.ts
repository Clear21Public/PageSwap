import { type IUser } from '../types/IUser.ts';
import { type IPropertyError } from '../types/IValidationError.ts';
import { ValidationError } from '../errors';
import { executeTransaction, initDB } from './db';

/**
 * UserRepository - Data access layer for User entities
 *
 * Provides CRUD operations with automatic concurrency control via IndexedDB transactions.
 * All methods are asynchronous and return Promises.
 */
export class UserRepository {
    private static minDelay = 500;
    private static maxDelay = 1500;

    /**
     * Initialize the database
     * Should be called once when the application starts
     */
    static async initialize(): Promise<void> {
        await initDB();
    }

    /**
     * Get a single user by ID
     * @param id - The user's unique identifier
     * @throws Error for database operation failures
     * @returns The user if found, undefined otherwise
     */
    static get(id: string): Promise<IUser | undefined> {
        return executeTransaction('readonly', (store) => store.get(id));
    }

    /**
     * Get all users with pagination support
     * @param skip - Number of records to skip (for pagination)
     * @param take - Number of records to return
     * @throws Error for database operation failures
     * @returns Array of users
     */
    static async getAll(
        skip: number = 0,
        take: number = Number.MAX_SAFE_INTEGER
    ): Promise<IUser[]> {
        await this.simulateNetworkDelay();
        return new Promise((resolve, reject) => {
            initDB()
                .then((db) => {
                    const transaction = db.transaction('users', 'readonly');
                    const store = transaction.objectStore('users');
                    const request = store.getAll();

                    request.onsuccess = () => {
                        const allUsers = request.result as IUser[];

                        // Apply pagination
                        const paginatedUsers = allUsers.slice(skip, skip + take);
                        resolve(paginatedUsers);
                    };

                    request.onerror = () => {
                        reject(request.error);
                    };
                })
                .catch(reject);
        });
    }

    /**
     * Add a new user or update an existing one
     * @param user - The user object to add/update
     * @returns The ID of the added/updated user
     * @throws ValidationError if validation fails
     * @throws Error for database operation failures
     */
    static async add(user: IUser): Promise<string> {
        this.validateUser(user);
        await this.simulateNetworkDelay();
        // Uncomment to simulate error
        // throw new Error();
        return executeTransaction('readwrite', (store) => store.put(user) as IDBRequest<string>);
    }

    /**
     * Delete a user by ID
     * @param id - The ID of the user to delete
     * @throws Error for database operation failures
     */
    static async delete(id: string): Promise<void> {
        await this.simulateNetworkDelay();
        // Uncomment to simulate error
        // throw new Error();
        return executeTransaction('readwrite', (store) => store.delete(id));
    }

    /**
     * Get the total count of users
     * @throws Error for database operation failures
     * @returns Total number of users in the database
     */
    static async count(): Promise<number> {
        return executeTransaction('readonly', (store) => store.count());
    }

    /**
     * Clear all users from the database
     * @throws Error for database operation failures
     * Useful for testing or resetting the application
     */
    static async clear(): Promise<void> {
        return executeTransaction('readwrite', (store) => store.clear());
    }

    /**
     * Seed the database with initial data
     * Typically called on first application load
     * @param users - Array of users to seed the database with
     */
    static async seed(users: IUser[]): Promise<void> {
        const currentCount = await this.count();

        // Only seed if database is empty
        if (currentCount === 0) {
            return new Promise((resolve, reject) => {
                initDB()
                    .then((db) => {
                        const transaction = db.transaction('users', 'readwrite');
                        const store = transaction.objectStore('users');

                        users.forEach((user) => store.put(user));

                        transaction.oncomplete = () => {
                            resolve();
                        };

                        transaction.onerror = () => {
                            reject(transaction.error);
                        };
                    })
                    .catch(reject);
            });
        }
    }

    /**
     * Add multiple users in a single transaction
     * @param users - Array of users to add
     * @throws ValidationError if any user validation fails
     */
    public static async addMany(users: IUser[]): Promise<void> {
        // Validate all users before starting transaction
        users.forEach((user) => this.validateUser(user));

        return new Promise((resolve, reject) => {
            initDB()
                .then((db) => {
                    const transaction = db.transaction('users', 'readwrite');
                    const store = transaction.objectStore('users');

                    // Add all users
                    users.forEach((user) => store.put(user));

                    transaction.oncomplete = () => {
                        resolve();
                    };

                    transaction.onerror = () => {
                        reject(transaction.error);
                    };
                })
                .catch(reject);
        });
    }

    /**
     * Validate a user object
     * @param user - The user object to validate
     * @throws ValidationError if validation fails
     */
    private static validateUser(user: IUser): void {
        const propertyErrors: IPropertyError[] = [];

        if (!user.firstName || user.firstName.trim() === '') {
            propertyErrors.push({
                property: 'firstName',
                message: 'First name is required'
            });
        }

        if (!user.lastName || user.lastName.trim() === '') {
            propertyErrors.push({
                property: 'lastName',
                message: 'Last name is required'
            });
        }

        // Age is optional, but if provided, must be a number greater than 0
        if (user.age !== undefined && user.age !== null) {
            if (typeof user.age !== 'number' || isNaN(user.age)) {
                propertyErrors.push({
                    property: 'age',
                    message: 'Age must be a valid number'
                });
            } else if (user.age <= 0) {
                propertyErrors.push({
                    property: 'age',
                    message: 'Age must be greater than 0'
                });
            }
        }

        if (propertyErrors.length > 0) {
            throw new ValidationError('User validation failed', propertyErrors);
        }
    }

    private static async simulateNetworkDelay(): Promise<void> {
        const delay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
        return new Promise((resolve) => setTimeout(resolve, delay));
    }
}
