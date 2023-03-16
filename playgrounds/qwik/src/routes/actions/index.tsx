import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ redirect }) => {
  throw redirect(301, '/actions/login');
};
