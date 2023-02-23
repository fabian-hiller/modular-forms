import { ActionButton, ButtonGroup, Description, Title } from '~/components';
import { LogoIcon } from '~/icons';

export default function HomePage() {
  return (
    <>
      <Title>Modular Forms: The modular form library for SolidJS</Title>
      <Description>
        Modular Forms is a JavaScript library that is build on top of SolidJS to
        validate and handle various types of forms. It is fast by default and
        the bundle size is small due to a modular design.
      </Description>

      <main class="flex h-full flex-1 flex-col items-center space-y-8 py-32 md:space-y-12 md:py-40 lg:justify-center lg:space-y-16">
        <h1 class="flex items-center text-2xl font-medium text-slate-900 dark:text-slate-200 md:text-[28px] lg:text-4xl">
          <LogoIcon class="mr-3 h-8 md:mr-4 md:h-9 lg:mr-6 lg:h-12" />
          Modular Forms
        </h1>
        <p class="px-4 text-center text-lg md:text-xl lg:text-3xl">
          The modular form library for SolidJS
          <span class="mt-3 block text-slate-500 md:mt-4 md:text-lg lg:mt-6 lg:text-2xl">
            Soon also available for Qwik!
          </span>
        </p>

        <ButtonGroup class="justify-center">
          <ActionButton
            variant="primary"
            label="Get started"
            type="link"
            href="/guides"
          />
          <ActionButton
            variant="secondary"
            label="Playground"
            type="link"
            href="/playground"
          />
        </ButtonGroup>
      </main>
    </>
  );
}
