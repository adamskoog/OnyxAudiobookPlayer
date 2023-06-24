import { useEffect, useRef, MutableRefObject } from 'react';

const useOutsideClick = (callback: () => void): MutableRefObject<any> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useOutsideClick;