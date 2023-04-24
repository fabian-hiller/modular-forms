import { makeEventListener } from '@solid-primitives/event-listener';
import { createStorageSignal } from '@solid-primitives/storage';
import { isClient } from '@solid-primitives/utils';
import clsx from 'clsx';
import {
  Accessor,
  batch,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  Match,
  on,
  onCleanup,
  Setter,
  Show,
  Switch,
  useContext,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { A, useLocation, useNavigate } from 'solid-start';
import { SystemIcon, TextLink } from '~/components';
import {
  AngleRigthIcon,
  CloseIcon,
  HashtagIcon,
  PageIcon,
  SearchIcon,
} from '~/icons';
import { createFocusTrap } from '~/primitives';
import { getFramework } from './framework';

type HitType = 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' | 'content';

type AlgoliaResult = {
  hits: {
    type: HitType;
    hierarchy: {
      lvl0: string;
      lvl1: string;
      lvl2: string;
      lvl3: string | null;
      lvl4: string | null;
    };
    content: string | null;
    url: string;
    _highlightResult: {
      hierarchy: {
        lvl0: { value: string };
        lvl1: { value: string };
        lvl2: { value: string };
        lvl3: { value: string } | undefined;
        lvl4: { value: string } | undefined;
        lvl5: { value: string } | undefined;
      };
    };
    _snippetResult?: {
      content: { value: string };
    };
  }[];
};

type SearchItem = {
  group: string;
  relation: 'page' | 'child' | 'none';
  type: HitType;
  page: string;
  text: string;
  path: string;
};

type SearchStorage = {
  [key: string]:
    | {
        result: SearchItem[];
        expires: number;
      }
    | undefined;
};

// Create search context
const SearchContext =
  createContext<[accessor: Accessor<boolean>, setter: Setter<boolean>]>();

type SearchProviderProps = {
  children: JSX.Element;
};

/**
 * Provides the search context to its child components.
 */
export function SearchProvider(props: SearchProviderProps) {
  // Use location and navigate
  const location = useLocation();
  const navigate = useNavigate();

  // Create open, input, loading, active index and error signal
  const [getOpen, setOpen] = createSignal(false);
  const [getInput, setInput] = createSignal('');
  const [getLoading, setLoading] = createSignal(false);
  const [getActiveIndex, setActiveIndex] = createSignal(0);
  const [getError, setError] = createSignal(false);

  // Create modal and input element signal
  const [getModalElement, setModalElement] = createSignal<HTMLDivElement>();
  const [getInputElement, setInputElement] = createSignal<HTMLInputElement>();

  // Create storage, resent and result signal
  const storageOptions = {
    serializer: (value: any) => JSON.stringify(value),
    deserializer: (value: string) => JSON.parse(value),
  };
  const [getStorage, setStorage] = createStorageSignal<SearchStorage>(
    'search-index',
    {},
    storageOptions
  );
  const [getRecent, setRecent] = createStorageSignal<SearchItem[]>(
    'search-recent',
    [],
    storageOptions
  );
  const [getResult, setResult] = createSignal<SearchItem[]>([]);

  // Create focus trap when search is open
  createFocusTrap(getModalElement, getOpen);

  // Do stuff when search is opened or closed
  createEffect(
    on(
      getOpen,
      () => {
        // Focus input and block background scrolling when search is opened
        if (getOpen()) {
          getInputElement()!.focus();
          document.body.style.overflow = 'hidden';

          // Reset state and background scrolling when search is closed
        } else {
          setInput('');
          setActiveIndex(0);
          setResult([]);
          document.body.style.overflow = '';
        }
      },
      { defer: true }
    )
  );

  // Close search when location changes
  createEffect(
    on([() => location.pathname, () => location.hash], () => setOpen(false), {
      defer: true,
    })
  );

  // Update search result and active index when input changes
  createEffect(
    on(
      getInput,
      (input) => {
        // If input is present, query and set search result
        if (input) {
          // Get current selected framework
          const framework = getFramework();

          // Create storage key and get its current value
          const storageKey = `${framework}:${input}`;
          const storageValue = getStorage()![storageKey];

          // Set result of index values is present and not expired
          if (storageValue && storageValue.expires >= Date.now()) {
            setActiveIndex(storageValue.result.length ? 0 : -1);
            setResult(storageValue.result);
            setLoading(false);

            // Otherwise query search result from Algolia with a short timeout to
            // reduce unnecessary queries
          } else {
            const timeout = setTimeout(async () => {
              try {
                const algoliaResult = (await (
                  await fetch(
                    `https://${
                      import.meta.env.VITE_ALGOLIA_APP_ID
                    }-dsn.algolia.net/1/indexes/${
                      import.meta.env.VITE_ALGOLIA_INDEX_NAME
                    }/query`,
                    {
                      method: 'POST',
                      headers: {
                        'X-Algolia-Application-Id': import.meta.env
                          .VITE_ALGOLIA_APP_ID,
                        'X-Algolia-API-Key': import.meta.env
                          .VITE_ALGOLIA_PUBLIC_API_KEY,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        query: input,
                        facetFilters: `framework:${framework}`,
                      }),
                    }
                  )
                ).json()) as AlgoliaResult;

                // Transform hits of Algolia result to our schema
                let prevItem: SearchItem;
                const searchResult: SearchItem[] = algoliaResult.hits.map(
                  (hit) => {
                    // Create path by removing origin from URL
                    const path = hit.url.replace(
                      import.meta.env.VITE_WEBSITE_URL,
                      ''
                    );

                    // Create search item object
                    const searchItem: SearchItem = {
                      group: `${hit.hierarchy.lvl0}: ${hit.hierarchy.lvl1}`,
                      relation:
                        hit.type === 'lvl2'
                          ? 'page'
                          : prevItem &&
                            prevItem.relation !== 'none' &&
                            prevItem.path.split('#')[0] === path.split('#')[0]
                          ? 'child'
                          : 'none',
                      type: hit.type,
                      page: hit._highlightResult.hierarchy.lvl2.value,
                      text:
                        hit.type === 'content'
                          ? hit._snippetResult!.content.value
                          : hit._highlightResult.hierarchy[hit.type]!.value,
                      path,
                    };

                    // Update previous item variable
                    prevItem = searchItem;

                    // Return search item object
                    return searchItem;
                  }
                );

                // Add search result to search storage
                setStorage((prevIndex) => ({
                  ...prevIndex,
                  [storageKey]: {
                    result: searchResult,
                    expires: Date.now() + 2.592e8, // 3 days
                  },
                }));

                // Set search result if input has not changed
                if (input === getInput()) {
                  batch(() => {
                    setActiveIndex(0);
                    setResult(searchResult);
                    setLoading(false);
                  });
                }

                // Update state in case of an error
              } catch (error) {
                setError(true);
              }
            }, 300);

            // Set loading to "true"
            setLoading(true);

            // Clear timeout if the input has changed in the meantime
            onCleanup(() => clearTimeout(timeout));
          }

          // Otherwise if input is empty, reset state
        } else {
          setActiveIndex(0);
          setResult([]);
          setLoading(false);
        }
      },
      { defer: true }
    )
  );

  /**
   * Returns the currently displayed search items.
   */
  const getSearchItems = () => (getInput() ? getResult() : getRecent()!);

  /**
   * Adds a item to the recent list.
   *
   * @param item The new item.
   */
  const addRecent = (item: SearchItem) =>
    setRecent((current) =>
      [item, ...current!.filter((i) => i !== item)].slice(0, 6)
    );

  // Add event listener to handle keydown events
  if (isClient) {
    makeEventListener(window, 'keydown', ({ metaKey, key }) => {
      // Open or close search
      if ((metaKey && key === 'k') || (getOpen() && key === 'Escape')) {
        setOpen((open) => !open);
      }

      if (getOpen()) {
        // Change active index
        if (key === 'ArrowUp' || key === 'ArrowDown') {
          const maxIndex = getSearchItems().length - 1;
          setActiveIndex((current) =>
            key === 'ArrowUp'
              ? current === 0
                ? maxIndex
                : current - 1
              : current === maxIndex
              ? 0
              : current + 1
          );
        }

        // Select current active index
        if (key === 'Enter') {
          const item = getSearchItems()[getActiveIndex()];
          if (item) {
            navigate(item.path);
            addRecent(item);
          }
        }
      }
    });
  }

  return (
    <SearchContext.Provider value={[getOpen, setOpen]}>
      {props.children}
      <Show when={getOpen()}>
        <div
          class="fixed left-0 top-0 z-50 h-screen w-screen lg:p-48"
          ref={setModalElement}
        >
          <div class="flex h-full w-full flex-col bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 lg:mx-auto lg:h-auto lg:max-h-full lg:max-w-3xl lg:rounded-3xl lg:bg-white lg:backdrop-blur-none lg:dark:bg-gray-900">
            {/* Header */}
            <header class="flex h-14 flex-shrink-0 items-center px-2 md:h-16 lg:h-[72px] lg:px-4">
              <form class="flex flex-1" onSubmit={(e) => e.preventDefault()}>
                <SystemIcon
                  icon={SearchIcon}
                  label={getLoading() ? 'Search' : 'Focus search input'}
                  type="button"
                  onClick={() => getInputElement()!.focus()}
                  loading={getLoading()}
                />
                <input
                  class="flex-1 bg-transparent px-2 text-lg text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-200 md:text-xl"
                  ref={setInputElement}
                  type="search"
                  placeholder="Search docs"
                  value={getInput()}
                  onInput={({ target }) => setInput(target.value)}
                />
              </form>
              <SystemIcon
                class="lg:!h-[22px] lg:!w-[22px]"
                icon={CloseIcon}
                label="Close search"
                type="button"
                onClick={() => setOpen(false)}
              />
            </header>

            {/* Content */}
            <div class="flex-1 overflow-y-auto overscroll-contain scroll-smooth p-4 lg:min-h-[120px] lg:px-6">
              <Switch>
                {/* Error */}
                <Match when={getError()}>
                  <p class="md:text-lg">
                    An unexpected error has occurred. If this happens regularly,
                    please create an{' '}
                    <TextLink
                      href={`${import.meta.env.VITE_GITHUB_URL}/issues/new`}
                      target="_blank"
                      colored
                      underlined
                    >
                      issue
                    </TextLink>{' '}
                    on Github.
                  </p>
                </Match>

                {/* No result */}
                <Match
                  when={getInput() && !getLoading() && !getResult().length}
                >
                  <p class="text-sm md:text-base">
                    No results for "
                    <span class="text-slate-900 dark:text-slate-200">
                      {getInput()}
                    </span>
                    "
                  </p>
                </Match>

                {/* Result */}
                <Match when={getInput() && getResult().length}>
                  <ul>
                    <For each={getResult()}>
                      {(item, getIndex) => {
                        const getPrevItem = createMemo(() => {
                          const index = getIndex();
                          return index > 0 ? getResult()[index - 1] : undefined;
                        });
                        const getGroup = createMemo(() =>
                          getPrevItem()?.group !== item.group
                            ? item.group
                            : undefined
                        );
                        return (
                          <li
                            class={clsx(
                              getIndex() > 0 &&
                                (getGroup()
                                  ? 'mt-9'
                                  : item.relation === 'page' &&
                                    getPrevItem()?.relation !== 'page'
                                  ? 'mt-6'
                                  : item.relation === 'child'
                                  ? 'border-l-2 border-l-slate-200 pl-2 pt-2.5 dark:border-l-slate-800'
                                  : 'mt-2.5')
                            )}
                          >
                            <Show when={getGroup()}>
                              <div class="mb-6 text-sm md:text-base">
                                {getGroup()}
                              </div>
                            </Show>
                            <SearchItem
                              {...item}
                              active={getIndex() === getActiveIndex()}
                              makeActive={() => setActiveIndex(getIndex())}
                              onClick={() => addRecent(item)}
                            />
                          </li>
                        );
                      }}
                    </For>
                  </ul>
                </Match>

                {/* Resent */}
                <Match when={getRecent()!.length}>
                  <div class="text-sm md:text-base">Recent</div>
                  <ul class="mt-6 space-y-2.5">
                    <For each={getRecent()}>
                      {(item, getIndex) => (
                        <li>
                          <SearchItem
                            {...item}
                            active={getIndex() === getActiveIndex()}
                            makeActive={() => setActiveIndex(getIndex())}
                            onClick={() => addRecent(item)}
                            recent
                          />
                        </li>
                      )}
                    </For>
                  </ul>
                </Match>
              </Switch>
            </div>

            {/* Footer */}
            <footer class="flex h-12 flex-shrink-0 items-center justify-end px-4 text-xs md:h-14 md:text-sm lg:h-[72px] lg:px-6">
              Search by
              <TextLink
                class="ml-3 md:ml-4"
                href="https://www.algolia.com/ref/docsearch/?utm_source=modularforms.dev&utm_medium=referral&utm_content=powered_by&utm_campaign=docsearch"
                target="_blank"
              >
                <svg
                  class="h-[18px] md:h-5"
                  viewBox="0 0 85 20"
                  role="img"
                  aria-label="Algolia logo"
                  fill="#003dff"
                  fill-rule="evenodd"
                >
                  <path d="M41.43 10.97V.62a.23.23 0 0 0-.26-.23l-1.94.3a.23.23 0 0 0-.2.23l.01 10.5a3.43 3.43 0 0 0 3.7 3.67.23.23 0 0 0 .23-.22V13.3a.23.23 0 0 0-.2-.22c-1.34-.16-1.34-1.83-1.34-2.1Z" />
                  <path d="M71.47 4.42h1.95a.23.23 0 0 1 .23.22v10.23a.23.23 0 0 1-.23.23h-1.95a.23.23 0 0 1-.23-.23V4.64a.23.23 0 0 1 .23-.22Z" />
                  <path d="M71.47 3.13h1.95a.23.23 0 0 0 .23-.22V.6a.23.23 0 0 0-.25-.2l-1.95.3a.23.23 0 0 0-.2.23v1.99a.23.23 0 0 0 .23.22Zm-3.37 7.84V.62a.23.23 0 0 0-.26-.23L65.9.7a.23.23 0 0 0-.2.23l.01 10.5a3.43 3.43 0 0 0 3.69 3.67.23.23 0 0 0 .23-.22V13.3a.23.23 0 0 0-.2-.22c-1.33-.16-1.33-1.83-1.33-2.1Zm-5.08-5.09a4.36 4.36 0 0 0-1.57-1.1 5.22 5.22 0 0 0-2-.37 5.07 5.07 0 0 0-2 .38 4.59 4.59 0 0 0-1.56 1.09 4.97 4.97 0 0 0-1.03 1.69 6.52 6.52 0 0 0-.36 2.24 5.67 5.67 0 0 0 .37 2.09 5.05 5.05 0 0 0 1.02 1.7 4.56 4.56 0 0 0 1.56 1.1 6.25 6.25 0 0 0 2.01.4 6.37 6.37 0 0 0 2.03-.4 4.46 4.46 0 0 0 1.56-1.1 4.94 4.94 0 0 0 1.01-1.7 5.79 5.79 0 0 0 .36-2.09 6.25 6.25 0 0 0-.39-2.24 5.05 5.05 0 0 0-1.01-1.7Zm-1.7 6.29a2.33 2.33 0 0 1-3.7 0 3.73 3.73 0 0 1-.67-2.35 4.2 4.2 0 0 1 .66-2.5 2.34 2.34 0 0 1 3.7 0 4.2 4.2 0 0 1 .66 2.5 3.75 3.75 0 0 1-.66 2.35ZM34.67 4.42h-1.9a5.29 5.29 0 0 0-4.45 2.46 5.6 5.6 0 0 0 1.1 7.3 3.2 3.2 0 0 0 .36.27 3.1 3.1 0 0 0 1.71.52h.32l.1-.02h.03a3.47 3.47 0 0 0 2.72-2.41v2.22a.23.23 0 0 0 .23.23h1.94a.23.23 0 0 0 .22-.23V4.66a.23.23 0 0 0-.22-.23Zm0 7.95a2.93 2.93 0 0 1-1.72.58h-.15a3.03 3.03 0 0 1-2.97-3.05 3.09 3.09 0 0 1 .21-1.11 2.94 2.94 0 0 1 2.73-1.92h1.9Zm47.65-7.95h-1.9a5.29 5.29 0 0 0-4.45 2.46 5.6 5.6 0 0 0 1.1 7.3 3.22 3.22 0 0 0 .36.27 3.1 3.1 0 0 0 1.7.52h.33l.1-.02h.02a3.47 3.47 0 0 0 2.73-2.41v2.22a.23.23 0 0 0 .22.23h1.94a.23.23 0 0 0 .23-.23V4.66a.23.23 0 0 0-.23-.23Zm0 7.95a2.93 2.93 0 0 1-1.73.58h-.14a3.03 3.03 0 0 1-2.97-3.05 3.09 3.09 0 0 1 .21-1.11 2.94 2.94 0 0 1 2.73-1.92h1.9ZM50.8 4.42h-1.9a5.29 5.29 0 0 0-4.45 2.46 5.56 5.56 0 0 0-.85 2.4 5.71 5.71 0 0 0 0 1.26 5.53 5.53 0 0 0 1.95 3.64 3.2 3.2 0 0 0 .36.27 3.1 3.1 0 0 0 1.7.52 3.1 3.1 0 0 0 1.86-.62 3.48 3.48 0 0 0 1.32-1.83v2.36a2.5 2.5 0 0 1-.66 1.9 3.2 3.2 0 0 1-2.24.64c-.43 0-1.1-.03-1.8-.1a.23.23 0 0 0-.23.17l-.5 1.65a.23.23 0 0 0 .2.3 16.72 16.72 0 0 0 2.1.17 6.08 6.08 0 0 0 4.18-1.24 4.7 4.7 0 0 0 1.35-3.4V4.64a.23.23 0 0 0-.23-.23H50.8Zm0 2.46s.03 5.35 0 5.51a2.89 2.89 0 0 1-1.67.57h-.3a3.06 3.06 0 0 1-2.66-4.17 2.94 2.94 0 0 1 2.74-1.91h1.9Z" />
                  <path d="M9.9.39a9.6 9.6 0 1 0 4.56 18.05.23.23 0 0 0 .04-.36l-.9-.8a.64.64 0 0 0-.66-.12A7.8 7.8 0 1 1 9.9 2.2h7.79v13.85l-4.42-3.93a.33.33 0 0 0-.48.05 3.62 3.62 0 1 1 .72-2.5.65.65 0 0 0 .2.43l1.16 1.02a.23.23 0 0 0 .37-.13 5.45 5.45 0 1 0-2.15 3.4l5.77 5.12a.38.38 0 0 0 .64-.29V.75a.36.36 0 0 0-.37-.36Z" />
                </svg>
              </TextLink>
            </footer>
          </div>
          <div
            class="hidden lg:absolute lg:left-0 lg:top-0 lg:-z-10 lg:block lg:h-full lg:w-full lg:cursor-default lg:bg-gray-200/50 lg:backdrop-blur-sm lg:dark:bg-gray-800/50"
            role="button"
            onClick={() => setOpen(false)}
          />
        </div>
      </Show>
    </SearchContext.Provider>
  );
}

type SearchItemProps = SearchItem & {
  active: boolean;
  makeActive: () => void;
  onClick: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>;
  recent?: boolean;
};

/**
 * Displays relevant info of a single search result and links to its page.
 */
function SearchItem(props: SearchItemProps) {
  // Create element signal
  const [getElement, setElement] = createSignal<HTMLAnchorElement>();

  // Scroll element into view if active
  createEffect(() => {
    if (props.active) {
      getElement()!.scrollIntoView({ block: 'nearest' });
    }
  });

  return (
    <A
      class={clsx(
        'focus-ring flex scroll-my-12 items-center rounded-2xl border-2 px-5 py-4 md:px-6',
        props.active
          ? 'border-transparent bg-sky-600/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400'
          : 'border-slate-200 dark:border-slate-800'
      )}
      ref={setElement}
      href={props.path}
      onMouseEnter={props.makeActive}
      onFocus={props.makeActive}
      onClick={props.onClick}
    >
      <Dynamic
        class="h-5 flex-shrink-0 md:h-6"
        component={props.relation === 'page' ? PageIcon : HashtagIcon}
      />
      <div
        class={clsx(
          'flex-1 px-4 md:px-5 [&_mark]:bg-transparent [&_mark]:font-medium',
          props.active
            ? '[&_mark]:text-sky-600 [&_mark]:underline [&_mark]:dark:text-sky-400'
            : '[&_mark]:text-slate-900 [&_mark]:dark:text-slate-200'
        )}
      >
        <Show
          when={
            props.type === 'content' &&
            (props.relation === 'none' || props.recent)
          }
        >
          <div class="mb-2 text-xs md:text-sm" innerHTML={props.page} />
        </Show>
        <div
          class="text-sm md:text-base"
          innerHTML={`${
            props.type !== 'lvl2' &&
            props.type !== 'content' &&
            (props.relation === 'none' || props.recent)
              ? `${props.page}: `
              : ''
          }${props.text}`}
        />
      </div>
      <AngleRigthIcon class="h-3 flex-shrink-0 md:h-4" />
    </A>
  );
}

/**
 * Provides the ability to access the search context.
 *
 * @returns The search context.
 */
export function useSearch() {
  return useContext(SearchContext)!;
}
