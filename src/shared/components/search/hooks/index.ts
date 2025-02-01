import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';

type UseSearchProps<T> = {
  data: T[];
  searchKey?: (item: T) => string;
  delay?: number;
};

export const useSearch = <T>({ data, delay = 300, searchKey }: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<T[]>([]);

  const debouncedSearch = useRef(
    debounce((key: string, data: T[]) => {
      const result = data.filter((item) => {
        const searchableValue = searchKey ? searchKey(item) : String(item);
        return searchableValue.toLowerCase().includes(key.toLowerCase());
      });
      setFilteredData(result);
    }, delay),
  );

  useEffect(() => {
    debouncedSearch.current(searchTerm, data);
  }, [searchTerm, data]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
};
