import {
  Accessor,
  batch,
  createSignal,
  JSX,
  Match,
  splitProps,
  Switch,
} from 'solid-js';
import { A } from 'solid-start';

export type DefaultButtonProps =
  | {
      type: 'button';
      onClick: () => any | Promise<any>;
    }
  | {
      type: 'submit';
      loading?: boolean;
    }
  | {
      type: 'link';
      href: string;
      download?: boolean | string;
      target?: '_blank';
    };

type UnstyledButtonProps = DefaultButtonProps & {
  class?: string;
  children: (getLoading: Accessor<boolean>) => JSX.Element;
  'aria-label'?: string;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export function UnstyledButton(props: UnstyledButtonProps) {
  // Create loading signal and split aria props
  const [getLoading, setLoading] = createSignal(false);
  const [ariaProps] = splitProps(props, ['aria-label']);

  return (
    <Switch>
      {/* Link button */}
      <Match when={props.type === 'link' && props}>
        {(getProps) => (
          <A
            {...ariaProps}
            class={getProps().class}
            href={getProps().href}
            download={getProps().download}
            target={getProps().target}
            rel={getProps().target === '_blank' ? 'noreferrer' : undefined}
          >
            {props.children(() => false)}
          </A>
        )}
      </Match>

      {/* Normal button */}
      <Match when={props.type === 'button' && props}>
        {(getProps) => (
          <button
            {...ariaProps}
            class={props.class}
            type="button"
            onClick={() => {
              const result = getProps().onClick();
              // Start and stop loading if function is async
              if (Promise.resolve(result) === result) {
                setLoading(true);
                Promise.resolve(result).then(() => {
                  setLoading(false);
                });
              }
            }}
            disabled={getLoading()}
          >
            {props.children(getLoading)}
          </button>
        )}
      </Match>

      {/* Submit button */}
      <Match when={props.type === 'submit' && props}>
        {(getProps) => (
          <button
            {...ariaProps}
            class={props.class}
            type="submit"
            disabled={getProps().loading}
          >
            {props.children(() => !!getProps().loading)}
          </button>
        )}
      </Match>
    </Switch>
  );
}
