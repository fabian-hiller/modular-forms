import clsx from 'clsx';
import { A } from 'solid-start';

type TextLinkProps = {
  class?: string;
  children: string;
  href: string;
  download?: boolean | string;
  target?: '_blank';
  colored?: boolean;
  underlined?: boolean;
};

/**
 * Text links take users to another location and usually appear within a
 * sentence.
 */
export function TextLink(props: TextLinkProps) {
  return (
    <A
      class={clsx(
        'focus-ring rounded focus-visible:outline-offset-4 focus-visible:ring-offset-[6px]',
        props.colored && 'text-sky-600 dark:text-sky-400',
        props.underlined &&
          'underline decoration-slate-400 decoration-dashed underline-offset-[3px] dark:decoration-slate-600',
        props.class
      )}
      href={props.href}
      download={props.download}
      target={props.target}
      rel={props.target === '_blank' ? 'noreferrer' : undefined}
    >
      {props.children}
    </A>
  );
}
