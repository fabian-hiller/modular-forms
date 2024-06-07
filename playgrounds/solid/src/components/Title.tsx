import { Title as SolidTitle } from '@solidjs/meta';
import { useLocation } from '@solidjs/router';

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
