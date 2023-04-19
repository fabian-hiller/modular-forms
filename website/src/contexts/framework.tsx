import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  JSX,
  Setter,
  useContext,
} from 'solid-js';
import { useLocation } from 'solid-start';
import { frameworkCookie } from '~/cookies';

export type Framework = 'solid' | 'qwik';

export const frameworks: Framework[] = ['solid', 'qwik'];

// Create framework context
const FrameworkContext =
  createContext<[accessor: Accessor<Framework>, setter: Setter<Framework>]>();

type FrameworkProviderProps = {
  cookie: Framework;
  children: JSX.Element;
};

/**
 * Provides the framework context to its child components.
 */
export function FrameworkProvider(props: FrameworkProviderProps) {
  // Create framework signal
  const [getFramework, setFramework] = createSignal<Framework>(
    (() => {
      const param = useLocation().pathname.split('/')[1] as Framework;
      return frameworks.includes(param) ? param : props.cookie;
    })()
  );

  // Update cookie when framework changes
  createEffect(async () => {
    document.cookie = await frameworkCookie.serialize(getFramework());
  });

  return (
    <FrameworkContext.Provider value={[getFramework, setFramework]}>
      {props.children}
    </FrameworkContext.Provider>
  );
}

/**
 * Provides the ability to access the framework context.
 *
 * @returns The framework context.
 */
export function useFramework() {
  return useContext(FrameworkContext)!;
}

/**
 * Returns the currently selected framework.
 *
 * @returns The selected framework.
 */
export function getFramework() {
  return useFramework()[0]();
}

/**
 * Sets the currently selected framework.
 *
 * @param framework The framework to bet set.
 */
export function setFramework(framework: Framework) {
  return useFramework()[1](framework);
}

/**
 * Returns whether SolidJS is currently selected as framework.
 *
 * @returns Whether SolidJS is selected.
 */
export function isSolid() {
  return getFramework() === 'solid';
}

/**
 * Returns whether Qwik is currently selected as framework.
 *
 * @returns Whether Qwik is selected.
 */
export function isQwik() {
  return getFramework() === 'qwik';
}
