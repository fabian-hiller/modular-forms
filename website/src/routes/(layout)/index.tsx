import clsx from 'clsx';
import { createMemo, createSignal, For, Show } from 'solid-js';
import {
  ActionButton,
  ButtonGroup,
  Description,
  Expandable,
  TextLink,
  Title,
} from '~/components';
import { getFramework } from '~/contexts';
import { PlusIcon } from '~/icons';
import { blurredCodeDarkUrl, blurredCodeLightUrl } from '~/images';
import { PreactLogo, QwikLogo, ReactLogo, SolidLogo } from '~/logos';

export default function HomePage() {
  // Create StackBlitz URL and FAQ index signal
  const [getStackBlitzUrl, setStackBlitzUrl] = createSignal<string>();
  const [getFaqIndex, setFaqIndex] = createSignal(0);

  return (
    <>
      <Title>Modular Forms: The modular and type-safe form library</Title>
      <Description>
        Modular Forms is a JavaScript library built on SolidJS, Qwik, Preact,
        and React to validate and handle various types of forms.
      </Description>

      <main class="flex flex-1 flex-col items-center space-y-24 py-24 md:space-y-36 md:py-36 xl:space-y-52 xl:py-52">
        {/* Pitch */}
        <section class="space-y-8 px-4 text-center md:max-w-4xl md:space-y-12 lg:space-y-16">
          <div class="absolute left-0 top-0 -z-10 flex w-full justify-center overflow-x-clip">
            <div class="relative w-full xl:w-0">
              <div class="absolute -right-[300px] -top-[250px] h-[600px] w-[600px] bg-[radial-gradient(theme(colors.yellow.500/.06),transparent_70%)] dark:bg-[radial-gradient(theme(colors.yellow.300/.06),transparent_70%)] md:-right-[500px] md:-top-[500px] md:h-[1000px] md:w-[1000px] xl:-right-[1100px] xl:-top-[500px]" />
              <div class="absolute -left-[370px] top-[200px] h-[600px] w-[600px] bg-[radial-gradient(theme(colors.sky.600/.08),transparent_70%)] dark:bg-[radial-gradient(theme(colors.sky.400/.08),transparent_70%)] md:-left-[550px] md:top-[100px] md:h-[1000px] md:w-[1000px] lg:top-[200px] xl:-left-[1100px] xl:top-[300px]" />
            </div>
          </div>
          <h1 class="text-xl font-medium text-slate-900 dark:text-slate-200 md:text-3xl lg:text-4xl xl:text-5xl">
            Modular and type-safe forms
          </h1>
          <p class="text-center leading-loose md:text-xl md:leading-loose xl:text-2xl xl:leading-loose">
            Build your next form with Modular Forms, the open source form
            library with performance, type safety and bundle size in mind.
          </p>
          <ButtonGroup class="justify-center">
            <ActionButton
              variant="primary"
              label="Get started"
              type="link"
              href={`/${getFramework()}/guides`}
            />
            <ActionButton
              variant="secondary"
              label="Playground"
              type="link"
              href={`/${getFramework()}/playground`}
            />
          </ButtonGroup>
        </section>

        {/* StackBlitz */}
        <section class="w-full px-3 md:max-w-5xl xl:max-w-[1360px] xl:px-10">
          <div class="relative z-0 flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border-[3px] border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900 md:border-4 lg:aspect-video lg:rounded-[32px]">
            <For
              each={[
                { theme: 'dark', url: blurredCodeDarkUrl },
                { theme: 'light', url: blurredCodeLightUrl },
              ]}
            >
              {({ theme, url }) => (
                <img
                  class={clsx(
                    'absolute -z-10 h-full w-full object-cover object-left',
                    theme === 'dark' ? 'hidden dark:block' : 'dark:hidden'
                  )}
                  src={url}
                  alt="Blurred TypeScript JSX code"
                />
              )}
            </For>
            <Show
              when={getStackBlitzUrl()}
              fallback={
                <div class="flex w-full flex-col items-center space-y-8 px-8">
                  <p class="text-center leading-loose md:text-lg md:leading-loose lg:text-xl lg:leading-loose">
                    Select your framework to load a StackBlitz example project
                  </p>
                  <div class="flex flex-wrap justify-center gap-4 md:gap-8">
                    <For
                      each={[
                        {
                          Logo: SolidLogo,
                          url: `${
                            import.meta.env.VITE_STACKBLITZ_SOLID_URL
                          }?embed=1&file=src%2Froutes%2Flogin.tsx`,
                        },
                        {
                          Logo: QwikLogo,
                          url: `${
                            import.meta.env.VITE_STACKBLITZ_QWIK_URL
                          }?embed=1&file=src%2Froutes%2Flogin%2Findex.tsx`,
                        },
                        {
                          Logo: PreactLogo,
                          url: `${
                            import.meta.env.VITE_STACKBLITZ_PREACT_URL
                          }?embed=1&file=src%2Froutes%2Flogin.tsx`,
                        },
                        {
                          Logo: ReactLogo,
                          url: `${
                            import.meta.env.VITE_STACKBLITZ_REACT_URL
                          }?embed=1&file=src%2Froutes%2Flogin.tsx`,
                        },
                      ]}
                    >
                      {({ Logo, url }) => (
                        <button
                          class="focus-ring group flex h-14 w-32 items-center justify-center rounded-xl border-2 border-slate-200 bg-white hover:border-sky-600/20 dark:border-slate-800 dark:bg-gray-900 hover:dark:border-sky-400/20 md:h-16 md:w-36 md:rounded-2xl md:border-[3px]"
                          type="button"
                          onClick={() => setStackBlitzUrl(url)}
                        >
                          <Logo class="h-9 text-slate-900 opacity-75 transition-opacity group-hover:opacity-100 dark:text-slate-200 md:h-12" />
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              }
            >
              <iframe class="h-full w-full" src={getStackBlitzUrl()} />
            </Show>
          </div>
        </section>

        {/* Highlights */}
        <section class="lg:max-w-6xl">
          <h2 class="px-4 text-center text-xl font-medium text-slate-900 dark:text-slate-200 md:text-2xl lg:text-3xl xl:text-4xl">
            Highlights you should not miss
          </h2>
          <ul class="mt-16 flex flex-wrap justify-center gap-16 px-8 md:mt-20 lg:mt-32 xl:mt-36 xl:gap-24">
            <For
              each={[
                {
                  emoji: '📦',
                  heading: 'Small bundle size',
                  text: 'Due to the modular design of our API the bundle size starts at 3 KB',
                },
                {
                  emoji: '🔒',
                  heading: 'Fully type safe',
                  text: 'Enjoy the benefits of auto-completion and type safety in your editor',
                },
                {
                  emoji: '🧩',
                  heading: 'Fine-grained updates',
                  text: 'Built on signals DOM updates are super fast and mostly fine-grained',
                },
                {
                  emoji: '🚧',
                  heading: 'Validate everything',
                  text: 'Supports form- and field-based validation with small validation snippets or Zod',
                },
                {
                  emoji: '🎨',
                  heading: 'Headless design',
                  text: 'Bring your own components or connect it to any pre-build component library',
                },
                {
                  emoji: '🧨',
                  heading: 'Powerful features',
                  text: 'Add dynamic field arrays and nest your form values as deep as you like ',
                },
              ]}
            >
              {({ emoji, heading, text }) => (
                <li class="flex flex-col items-center space-y-6 text-center md:space-y-7 lg:max-w-[45%] lg:flex-row lg:items-start lg:space-x-8 lg:space-y-0 lg:text-left">
                  <div class="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-sky-600/10 text-2xl dark:bg-sky-400/5">
                    {emoji}
                  </div>
                  <div class="max-w-[370px] space-y-4 md:space-y-5">
                    <h3 class="text-lg font-medium text-slate-900 dark:text-slate-200 md:text-xl">
                      {heading}
                    </h3>
                    <p class="leading-loose md:text-lg md:leading-loose">
                      {text}
                    </p>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </section>

        {/* FAQ */}
        <section class="space-y-14 md:max-w-4xl md:space-y-20 lg:space-y-32">
          <h2 class="px-4 text-center text-xl font-medium text-slate-900 dark:text-slate-200 md:text-2xl lg:text-3xl xl:text-4xl">
            Frequently asked questions
          </h2>
          <ul class="space-y-12 md:space-y-14 lg:space-y-16">
            <For
              each={[
                {
                  heading: 'Where can I enter my credit card?',
                  Text: () => (
                    <>
                      You don't have to! Modular Forms is available free of
                      charge and licensed under the{' '}
                      <TextLink
                        href={`${
                          import.meta.env.VITE_GITHUB_URL
                        }/tree/main/LICENSE.md`}
                        target="_blank"
                        underlined
                        colored
                      >
                        MIT License
                      </TextLink>
                      . We finance the development from our own funds. If your
                      company would like to support us, you can take a look at
                      our sponsor page on{' '}
                      <TextLink
                        href="https://github.com/sponsors/fabian-hiller"
                        target="_blank"
                        underlined
                        colored
                      >
                        GitHub
                      </TextLink>
                      .
                    </>
                  ),
                },
                {
                  heading: 'What exactly does Modular Forms do?',
                  Text: () => (
                    <>
                      Modular Forms mainly takes care of the state management
                      and input validation of your form. The library provides
                      you with a well thought-out API that takes care of
                      important functions, such as capturing inputs. I recommend
                      taking a look at the debugger in our{' '}
                      <TextLink
                        href={`/${getFramework()}/playground`}
                        underlined
                        colored
                      >
                        playground
                      </TextLink>
                      .
                    </>
                  ),
                },
                {
                  heading: 'How does a modular design reduce bundle size?',
                  Text: () => (
                    <>
                      Due to the modular design of our API you only need to
                      import the functionality you actually need. It also allows
                      us to add new features without increasing the initial
                      bundle size of about 3 KB. You can read more about it{' '}
                      <TextLink
                        href={`/${getFramework()}/guides/philosophy#bundle-size`}
                        underlined
                        colored
                      >
                        here
                      </TextLink>
                      .
                    </>
                  ),
                },
                {
                  heading: 'What are fine-grained DOM updates?',
                  Text: () => (
                    <>
                      Modular Forms composes the state of your form from many
                      individual signals. This makes it possible to make each
                      DOM update as granular as the underlying framework allows.
                      This means that if the value of a field changes, the form
                      does not have to be re-rendered and instead only
                      individual DOM nodes are specifically updated. You can
                      read more about signals{' '}
                      <TextLink
                        href="https://www.builder.io/blog/usesignal-is-the-future-of-web-frameworks"
                        target="_blank"
                        underlined
                        colored
                      >
                        here
                      </TextLink>
                      .
                    </>
                  ),
                },
                {
                  heading: 'Can I use it with my own components?',
                  Text: () => (
                    <>
                      Yes and with any other pre-build UI components! Our{' '}
                      <TextLink
                        href={`/${getFramework()}/api/Field`}
                        underlined
                        colored
                      >
                        <code class="rounded-lg bg-slate-100 px-2 py-1 text-slate-700 dark:bg-gray-800 dark:text-slate-300">
                          Field
                        </code>
                      </TextLink>{' '}
                      component does not render its own HTML elements. It acts
                      as a data layer and provides you the state of a field,
                      which you can use to display a custom UI.
                    </>
                  ),
                },
              ]}
            >
              {({ heading, Text }, getIndex) => {
                const getOpen = createMemo(() => getFaqIndex() === getIndex());
                return (
                  <li class="flex flex-col px-8">
                    <button
                      class={clsx(
                        'focus-ring flex justify-between space-x-4 rounded-md transition-colors focus-visible:outline-offset-[6px] focus-visible:ring-offset-8',
                        getOpen()
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-slate-800 hover:text-slate-700 dark:text-slate-300 hover:dark:text-slate-400'
                      )}
                      onClick={() => setFaqIndex(getIndex())}
                      disabled={getOpen()}
                      aria-expanded={getOpen()}
                      aria-controls={`faq-${getIndex()}`}
                    >
                      <h3 class="text-left font-medium leading-relaxed md:text-xl lg:text-2xl">
                        {heading}
                      </h3>
                      <PlusIcon
                        class={clsx(
                          'mt-1.5 h-4 flex-shrink-0 transition-transform lg:h-5',
                          getOpen() && 'rotate-45'
                        )}
                        stroke-width={6}
                      />
                    </button>
                    <Expandable
                      id={`faq-${getIndex()}`}
                      class="overflow-hidden"
                      expanded={getOpen()}
                    >
                      <p class="pt-6 leading-loose md:pt-7 md:text-lg md:leading-loose lg:pt-8 lg:text-xl lg:leading-loose">
                        <Text />
                      </p>
                    </Expandable>
                  </li>
                );
              }}
            </For>
          </ul>
        </section>

        {/* CTA */}
        <ButtonGroup class="justify-center">
          <ActionButton
            variant="primary"
            label="Get started"
            type="link"
            href={`/${getFramework()}/guides`}
          />
          <ActionButton
            variant="secondary"
            label="Playground"
            type="link"
            href={`/${getFramework()}/playground`}
          />
        </ButtonGroup>
      </main>
    </>
  );
}
