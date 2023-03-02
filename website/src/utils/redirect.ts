/**
 * Returns a redirects response to the client.
 *
 * @param href The href to redirect to.
 *
 * @returns A response object.
 */
export function redirect(href: string): Response {
  return new Response('', {
    status: 302,
    headers: {
      Location: href,
    },
  });
}
