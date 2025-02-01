import { SearchIcon, X } from 'lucide-react';
import { memo, useRef } from 'react';

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (key: string) => void;
  placeholder?: string;
}

export const Search = memo(
  ({ searchTerm, setSearchTerm, placeholder = 'Search...' }: SearchProps) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="flex items-center justify-center relative">
        <input
          type="text"
          ref={searchInputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 px-10 text-sm border border-input bg-background shadow-sm rounded-lg"
        />
        <SearchIcon size={17} className="absolute left-3 text-gray-500" />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              searchInputRef?.current?.focus();
            }}
            className="absolute right-3 text-gray-500"
          >
            <X size={17} />
          </button>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.setSearchTerm === nextProps.setSearchTerm &&
    prevProps.placeholder === nextProps.placeholder,
);
