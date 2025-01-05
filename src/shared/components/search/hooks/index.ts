import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

type UseSearchProps<T> = {
  data: T[];
  searchKey?: (item: T) => string;
  delay?: number;
};

export const useSearch = <T>({ data, delay = 300, searchKey }: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<T[]>([]);

  const updateSearch = useCallback(
    debounce((key: string) => {
      const result = data.filter((item) => {
        const searchableValue = searchKey ? searchKey(item) : String(item);
        return searchableValue.toLowerCase().includes(key.toLowerCase());
      });
      setFilteredData(result);
    }, delay),
    [data, delay, searchKey],
  );

  useEffect(() => {
    updateSearch(searchTerm);
    return () => updateSearch.cancel();
  }, [searchTerm, updateSearch]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
};
