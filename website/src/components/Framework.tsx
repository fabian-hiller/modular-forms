import { JSX, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { getFramework, type Framework } from '~/contexts';

type FrameworkProps = {
  frameworks: Framework[];
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
      <Show when={props.frameworks.includes(getFramework())}>
        {props.children}
      </Show>
    </Dynamic>
  );
}

/**
 * Displays its children when SolidJS is currently selected.
 */
export function Solid(props: Omit<FrameworkProps, 'frameworks'>) {
  return <Framework {...props} frameworks={['solid']} />;
}

/**
 * Displays its children when Qwik is currently selected.
 */
export function Qwik(props: Omit<FrameworkProps, 'frameworks'>) {
  return <Framework {...props} frameworks={['qwik']} />;
}

/**
 * Displays its children when Preact is currently selected.
 */
export function Preact(props: Omit<FrameworkProps, 'frameworks'>) {
  return <Framework {...props} frameworks={['preact']} />;
}

/**
 * Displays its children when SolidJS or Qwik is currently selected.
 */
export function SolidOrQwik(props: Omit<FrameworkProps, 'frameworks'>) {
  return <Framework {...props} frameworks={['solid', 'qwik']} />;
}

/**
 * Displays its children when SolidJS or Preact is currently selected.
 */
export function SolidOrPreact(props: Omit<FrameworkProps, 'frameworks'>) {
  return <Framework {...props} frameworks={['solid', 'preact']} />;
}

/**
 * Displays its children when Qwik or Preact is currently selected.
 */
export function QwikOrPreact(props: Omit<FrameworkProps, 'frameworks'>) {
  return <Framework {...props} frameworks={['qwik', 'preact']} />;
}
