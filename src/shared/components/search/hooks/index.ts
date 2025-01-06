import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

type UseSearchProps<T> = {
  data: T[];
  searchKey?: (item: T) => string;
  delay?: number;
};

export const useSearch = <T>({ data, delay = 50, searchKey }: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSetSearchTerm = useMemo(() => debounce(setSearchTerm, delay), [delay]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      const searchableValue = searchKey ? searchKey(item) : String(item);
      return searchableValue.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  useEffect(() => {
    return () => debouncedSetSearchTerm.cancel();
  }, [debouncedSetSearchTerm]);

  return {
    searchTerm,
    setSearchTerm: debouncedSetSearchTerm,
    filteredData,
  };
};
