import { useFramework } from '~/contexts';

/**
 * Returns whether SolidJS is currently selected as framework.
 *
 * @returns Whether SolidJS is selected.
 */
export function isSolid() {
  const [getFramework] = useFramework();
  return getFramework() === 'solid';
}
