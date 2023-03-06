import { getFramework } from './getFramework';

/**
 * Returns whether SolidJS is currently selected as framework.
 *
 * @returns Whether SolidJS is selected.
 */
export function isSolid() {
  return getFramework() === 'solid';
}
