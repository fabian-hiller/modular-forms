import { Title as SolidTitle, useLocation } from 'solid-start';

type TitleProps = {
  children: string;
};

/**
 * Title of the page that is displayed in the browser tab, for example.
 */
export function Title(props: TitleProps) {
  const location = useLocation();
  return (
    <SolidTitle>
      {props.children}
      {location.pathname !== '/' && ' | Modular Forms Playground'}
    </SolidTitle>
  );
}
