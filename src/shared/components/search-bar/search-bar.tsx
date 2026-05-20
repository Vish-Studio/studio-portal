import { Search } from '@/src/shared/components/material-icon/material-lucide-icons';
import { FunctionComponent } from "react";


interface Props {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

const SearchBar: FunctionComponent<Props> = ({
  className = "",
  placeholder = "Search members...",
  value: search,
  onChange: setSearch,
  autoFocus = false,
}) => {
  return (
    <div className={`search-bar relative w-72 ${className}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoFocus={autoFocus}
        className="w-full bg-white border border-gray-200 text-gray-900 text-sm py-2 pl-8 pr-3 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all placeholder:text-gray-400"
      />
    </div>
  )
}

export default SearchBar;