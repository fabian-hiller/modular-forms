import { Accessor } from 'solid-js';
// import { Meta } from 'solid-start';

type DescriptionProps = {
  children: string | Accessor<HTMLElement>;
};

/**
 * Description of the page that is displayed in search engines and social media
 * snippets, for example.
 */
export function Description(props: DescriptionProps) {
  // TODO: Enable <Meta /> again once issue #28 of @solidjs/meta is fixed
  return <></>;
  // return (
  //   <Meta
  //     name="description"
  //     content={
  //       typeof props.children === 'function'
  //         ? props.children()?.innerText?.replace(/\n/g, ' ') || ''
  //         : props.children
  //     }
  //   />
  // );
}
