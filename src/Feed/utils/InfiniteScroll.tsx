import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import throttle from 'lodash.throttle';

interface InfiniteScrollProps {
  loader?: ReactNode;
  hasMore: boolean;
  next: () => void;
  children: ReactNode;
  mainElement: Document | ShadowRoot;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loader,
  hasMore,
  next,
  children,
  mainElement,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    await next();
    setLoading(false);
  }, [hasMore, loading, next]);

  const handleScroll = useCallback(
    throttle(() => {
      const container = mainElement.getElementById('ss-notification-container');
      if (!container || loading || !hasMore) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const scrollPosition = scrollTop + clientHeight;
      const halfwayPoint = scrollHeight * 0.8;

      if (scrollPosition >= halfwayPoint) {
        fetchMore();
      }
    }, 500),
    [fetchMore, hasMore, loading]
  );

  useEffect(() => {
    const container = mainElement.getElementById('ss-notification-container');
    if (!container) return;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {children}
      {loading && loader}
    </>
  );
};

export default InfiniteScroll;
