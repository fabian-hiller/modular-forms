import { Meta, Title } from 'solid-start';
import { ActionButton, ButtonGroup } from '~/components';

export default function NotFoundPage() {
  return (
    <>
      <Title>Page not found | Modular Forms</Title>
      <Meta
        name="description"
        content="Sorry, the page you are looking for could not be found. You can write us a message if you can't find what you are looking for or return to the home page."
      />

      <main class="flex w-full max-w-screen-lg flex-1 flex-col self-center py-12 md:py-20 lg:py-32">
        <article>
          <h1>Page not found</h1>
          <p>
            Sorry, the page you are looking for could not be found. You can
            write us a message if you can't find what you are looking for or
            return to the home page.
          </p>

          <ButtonGroup>
            <ActionButton
              variant="primary"
              label="Home page"
              type="link"
              href="/"
            />
            <ActionButton
              variant="secondary"
              label="Contact us"
              type="link"
              href="/legal/imprint"
            />
          </ButtonGroup>
        </article>
      </main>
    </>
  );
}
