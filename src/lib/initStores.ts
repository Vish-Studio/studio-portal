/**
 * Clean-slate data bootstrapping.
 *
 * Stores are no longer hydrated with local mock data at startup. Firestore
 * streams are attached by feature stores and route-level components.
 */
export function initStores(): void {
  // Intentionally empty.
}
