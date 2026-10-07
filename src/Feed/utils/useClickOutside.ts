import { useEffect } from 'react';

// Improved version of https://usehooks.com/useOnClickOutside/
export default function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    // composedPath sees through open shadow roots, where event.target is
    // retargeted to the shadow host when observed from document
    const isInside = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element) return false;
      if (typeof event.composedPath === 'function') {
        return event.composedPath().includes(element);
      }
      return element.contains(event.target as Node);
    };

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || isInside(event)) return;

      handler(event);
    };

    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      startedWhenMounted = !!ref.current;
      startedInside = isInside(event);
    };

    document.addEventListener('mousedown', validateEventStart);
    document.addEventListener('touchstart', validateEventStart);
    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('mousedown', validateEventStart);
      document.removeEventListener('touchstart', validateEventStart);
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);
}
