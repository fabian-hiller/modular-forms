// Create counter variable
let counter = 0;

/**
 * Returns a unique ID counting up from zero.
 *
 * @returns A unique ID.
 */
export function getUniqueId(): number {
  return counter++;
}
