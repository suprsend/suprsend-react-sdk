import { useEffect } from 'react';

function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>, // The ref to the DOM element
  handler: (event: MouseEvent | TouchEvent) => void // The callback function when clicking outside
) {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    // Listener function for clicks and touches
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendant elements
      if (ref.current && ref.current.contains(event.target as Node)) return;

      handler(event);
    };

    // Function to track if the click started inside or outside
    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      startedWhenMounted = Boolean(ref.current);
      startedInside = !!(
        ref.current && ref.current.contains(event.target as Node)
      );
    };

    // Add event listeners
    document.addEventListener('mousedown', validateEventStart);
    document.addEventListener('touchstart', validateEventStart);
    document.addEventListener('click', listener);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', validateEventStart);
      document.removeEventListener('touchstart', validateEventStart);
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]); // Re-run the effect if ref or handler changes
}

export default useClickOutside;
