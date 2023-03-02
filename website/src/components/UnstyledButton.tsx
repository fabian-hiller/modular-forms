import { createSignal, JSX, Match, Switch } from 'solid-js';
import { A } from 'solid-start';

export type DefaultButtonProps =
  | {
      type: 'button';
      onClick: () => unknown | Promise<unknown>;
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
  children: (renderProps: { loading?: boolean }) => JSX.Element;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export function UnstyledButton(props: UnstyledButtonProps) {
  // Create loading signal
  const [getLoading, setLoading] = createSignal(false);

  return (
    <Switch>
      {/* Link button */}
      <Match when={props.type === 'link' && props} keyed>
        {(link) => (
          <A
            class={props.class}
            href={link.href}
            download={link.download}
            target={link.target}
            rel={link.target === '_blank' ? 'noreferrer' : undefined}
          >
            {props.children({})}
          </A>
        )}
      </Match>

      {/* Normal button */}
      <Match when={props.type === 'button' && props} keyed>
        {(buttton) => (
          <button
            class={props.class}
            type="button"
            onClick={() => {
              const result = buttton.onClick();
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
            {props.children({
              get loading() {
                return getLoading();
              },
            })}
          </button>
        )}
      </Match>

      {/* Submit button */}
      <Match when={props.type === 'submit' && props} keyed>
        {(submit) => (
          <button class={props.class} type="submit" disabled={submit.loading}>
            {props.children({
              get loading() {
                return submit.loading;
              },
            })}
          </button>
        )}
      </Match>
    </Switch>
  );
}
