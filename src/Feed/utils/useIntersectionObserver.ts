import { useState, useRef, useCallback } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | Document | null;
  rootMargin?: string;
  enable?: boolean;
}

type IntersectionObserverEntryOrNull = IntersectionObserverEntry | null;

export default function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): [React.RefCallback<Element>, IntersectionObserverEntryOrNull] {
  const { threshold = 1, root = null, rootMargin = '0px', enable } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntryOrNull>(null);

  const previousObserver = useRef<IntersectionObserver | null>(null);

  const customRef = useCallback(
    (node: Element | null) => {
      if (!enable) return;
      if (previousObserver.current) {
        previousObserver.current.disconnect();
        previousObserver.current = null;
      }

      if (node?.nodeType === Node.ELEMENT_NODE) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setEntry(entry);
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
            }
          },
          { threshold, root, rootMargin }
        );

        observer.observe(node);

        previousObserver.current = observer;
      }
    },
    [threshold, root, rootMargin]
  );

  return [customRef, entry];
}
