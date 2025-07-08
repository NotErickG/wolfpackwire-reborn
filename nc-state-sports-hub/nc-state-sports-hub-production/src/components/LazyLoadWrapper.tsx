import React, { useRef, useEffect, useState, Suspense, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner'; // Assuming you have a LoadingSpinner component

interface LazyLoadWrapperProps {
  children: ReactNode;
  height?: string; // Optional height for the wrapper to prevent layout shifts
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ children, height = '200px' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        rootMargin: '100px', // Load component when it's 100px from viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : height }}>
      {isVisible ? (
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      ) : (
        <div className="flex items-center justify-center" style={{ height }}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default LazyLoadWrapper;
