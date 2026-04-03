import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

export default function SearchDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full h-[40px] px-[12px] py-[10px] bg-white border border-btn-border rounded-[6px] flex items-center justify-between gap-[4px] text-[14px] cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${value ? 'text-gray-950' : 'text-gray-950'}`}
      >
        <span className="truncate text-left">{selectedLabel}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[42px] left-0 w-full bg-white border border-btn-border rounded-[6px] shadow-lg z-50 max-h-[280px] flex flex-col">
          <div className="p-[8px] border-b border-line">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full h-[32px] px-[8px] text-[13px] border border-btn-border rounded-[4px] outline-none focus:border-primary-green"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
                setSearch('');
              }}
              className={`w-full text-left px-[12px] py-[8px] text-[13px] hover:bg-bg cursor-pointer border-none bg-transparent ${
                !value ? 'text-primary-red font-semibold' : 'text-gray-950'
              }`}
            >
              {placeholder}
            </button>
            {filtered.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-[12px] py-[8px] text-[13px] hover:bg-bg cursor-pointer border-none bg-transparent ${
                  value === option.value ? 'text-primary-red font-semibold' : 'text-gray-950'
                }`}
              >
                {option.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-[12px] py-[8px] text-[13px] text-gray-400">
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
