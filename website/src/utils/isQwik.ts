import { useFramework } from '~/contexts';

/**
 * Returns whether Qwik is currently selected as framework.
 *
 * @returns Whether Qwik is selected.
 */
export function isQwik() {
  const [getFramework] = useFramework();
  return getFramework() === 'qwik';
}
