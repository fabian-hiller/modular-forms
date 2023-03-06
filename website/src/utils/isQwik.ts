import { getFramework } from './getFramework';

/**
 * Returns whether Qwik is currently selected as framework.
 *
 * @returns Whether Qwik is selected.
 */
export function isQwik() {
  return getFramework() === 'qwik';
}
