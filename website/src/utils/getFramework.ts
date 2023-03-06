import { useFramework } from '~/contexts';

/**
 * Returns the currently selected framework.
 *
 * @returns The selected framework.
 */
export function getFramework() {
  return useFramework()[0]();
}
