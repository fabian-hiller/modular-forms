import { makeEventListener } from '@solid-primitives/event-listener';
import { Accessor, createEffect, onCleanup } from 'solid-js';

/**
 * Creates a focus trap for a specific area for better accessibility when the
 * tab key is used for navigation.
 *
 * @param getRootElement The root element of the focus trap.
 * @param getActive Whether the focus trap is active.
 */
export function createFocusTrap(
  getRootElement: Accessor<HTMLElement | undefined>,
  getActive: Accessor<boolean>
) {
  createEffect(() => {
    if (getActive()) {
      // Get root element
      const rootElement = getRootElement();

      // Continue if root element is available
      if (rootElement) {
        // Get current active element
        const { activeElement } = document;

        // Focus root element
        rootElement.focus();

        // Query focusable elements
        const elements = [
          ...rootElement.querySelectorAll<
            HTMLAnchorElement | HTMLButtonElement | HTMLInputElement
          >('a, button, input'),
        ].filter((element) => element.offsetParent !== null);

        // Get first and last focusable element
        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        // Create "keydown" event listener
        makeEventListener(rootElement, 'keydown', (event) => {
          // Continue if user pressed "Tab" key
          if (event.key === 'Tab') {
            // Get currently active element
            const { activeElement } = document;

            // Prevent user from leaving focus area by manually focusing
            // first or last focusable element of the root element
            if (
              (event.shiftKey && firstElement === activeElement) ||
              (!event.shiftKey && lastElement === activeElement)
            ) {
              event.preventDefault();
              (event.shiftKey ? lastElement : firstElement).focus();
            }
          }
        });

        // Focus prevoius active element on cleanup
        onCleanup(() => {
          if (activeElement instanceof HTMLElement) {
            activeElement.focus({ preventScroll: true });
          }
        });
      }
    }
  });
}
