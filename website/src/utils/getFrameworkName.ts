import { Framework } from '~/contexts';

/**
 * Returns the name of the framework by its identifier.
 *
 * @param framework The framework identifier.
 *
 * @returns The name of the Framework
 */
export function getFrameworkName(framework: Framework) {
  return { solid: 'SolidJS', qwik: 'Qwik', preact: 'Preact' }[framework];
}
