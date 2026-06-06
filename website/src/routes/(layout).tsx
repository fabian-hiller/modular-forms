import { useRouteData, Outlet } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { Banner, Header, Footer, RoutingIndicator } from '~/components';
import {
  Framework,
  FrameworkProvider,
  frameworks,
  SearchProvider,
} from '~/contexts';
import { frameworkCookie } from '~/cookies';

export function routeData() {
  return {
    getCookie: createServerData$<Framework>(async (_, { request }) => {
      const framework = await frameworkCookie.parse(
        request.headers.get('Cookie')
      );
      return frameworks.includes(framework) ? framework : 'solid';
    }),
  };
}

export default function Layout() {
  // Use route data
  const { getCookie } = useRouteData<typeof routeData>();

  return (
    <FrameworkProvider cookie={getCookie()!}>
      <SearchProvider>
        <RoutingIndicator />
        <Banner />
        <Header />
        <Outlet />
        <Footer />
      </SearchProvider>
    </FrameworkProvider>
  );
}
