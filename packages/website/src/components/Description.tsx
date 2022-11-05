import { Accessor } from 'solid-js';
import { Meta } from 'solid-start';

type DescriptionProps = {
  children: string | Accessor<HTMLElement>;
};

/**
 * Description of the page that is displayed in search engines and social media
 * snippets, for example.
 */
export function Description(props: DescriptionProps) {
  return (
    <Meta
      name="description"
      content={
        typeof props.children === 'string'
          ? props.children
          : props.children().innerText.replace(/\n/g, ' ')
      }
    />
  );
}
