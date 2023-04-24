import clsx from 'clsx';
import { JSX, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { getFramework, type Framework } from '~/contexts';

type FrameworkProps = {
  framework: Framework;
  children: JSX.Element;
  block?: boolean;
};

/**
 * Displays its children when the specified framework is currently selected.
 */
function Framework(props: FrameworkProps) {
  return (
    <Dynamic
      class={props.block ? 'framework' : undefined}
      component={props.block ? 'div' : 'span'}
    >
      <Show when={props.framework === getFramework()}>{props.children}</Show>
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
