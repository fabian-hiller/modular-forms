import clsx from 'clsx';
import { JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { getFramework, type Framework } from '~/contexts';

type FrameworkProps = {
  block?: boolean;
  framework: Framework;
  children: JSX.Element;
};

/**
 * Displays its children when the specified framework is currently selected.
 */
function Framework(props: FrameworkProps) {
  return (
    <Dynamic
      class={clsx('framework', getFramework() !== props.framework && 'hidden')}
      component={props.block ? 'div' : 'span'}
    >
      {props.children}
    </Dynamic>
  );
}

/**
 * Displays its children when SolidJS is currently selected.
 */
export function Solid(props: Omit<FrameworkProps, 'framework'>) {
  return <Framework {...props} framework="solid" />;
}

/**
 * Displays its children when Qwik is currently selected.
 */
export function Qwik(props: Omit<FrameworkProps, 'framework'>) {
  return <Framework {...props} framework="qwik" />;
}
