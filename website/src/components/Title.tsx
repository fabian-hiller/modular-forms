import { Title as SolidTitle, useLocation } from 'solid-start';
import { useFramework } from '~/contexts';
import { getFrameworkName } from '~/utils';

type TitleProps = {
  children: string;
};

/**
 * Title of the page that is displayed in the browser tab, for example.
 */
export function Title(props: TitleProps) {
  // Use location and framework
  const location = useLocation();
  const [getFramework] = useFramework();

  /**
   * Creates the page title and returns it.
   */
  const getTitle = () => {
    // Get pathname and framework
    const { pathname } = location;
    const framework = getFramework();

    // Create title variable
    let title = props.children;

    // Add category if necessary
    if (pathname.includes('/guides/')) {
      title = `Guide: ${title}`;
    } else if (pathname.includes('/api/')) {
      title = `API: ${title}`;
    } else if (pathname.includes('/playground/')) {
      title = `Playground: ${title}`;
    }

    // Add framework if necessary
    if (pathname.startsWith(`/${framework}/`)) {
      title += ` (${getFrameworkName(framework)})`;
    }

    // Add site name if necessary
    if (pathname !== '/') {
      title += ' | Modular Forms';
    }

    // Return final title
    return title;
  };

  return <SolidTitle>{getTitle()}</SolidTitle>;
}
