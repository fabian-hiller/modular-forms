import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  JSX,
  Setter,
  useContext,
} from 'solid-js';
import { frameworkCookie } from '~/cookies';

export type Framework = 'solid' | 'qwik';

// Create framework context
const FrameworkContext =
  createContext<[accessor: Accessor<Framework>, setter: Setter<Framework>]>();

type FrameworkProviderProps = {
  framework: Framework;
  children: JSX.Element;
};

/**
 * Provides the framework context to its child components.
 */
export function FrameworkProvider(props: FrameworkProviderProps) {
  // Create framework signal
  const [getFramework, setFramework] = createSignal<Framework>(props.framework);

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
