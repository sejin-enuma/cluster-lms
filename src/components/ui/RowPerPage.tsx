import { useState, useRef, useEffect } from 'react';

const OPTIONS = [10, 50, 100];

interface RowPerPageProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RowPerPage({ value, onChange }: RowPerPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-[32px] w-[130px] px-[12px] py-[10px] bg-white border border-btn-border rounded-[6px] flex items-center justify-between text-[13px] text-gray-950 cursor-pointer"
      >
        <span>Row {value}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-[36px] right-0 bg-white border border-btn-border rounded-[6px] shadow-lg z-50 min-w-[130px] py-[4px]">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-[12px] py-[6px] text-[13px] hover:bg-bg cursor-pointer border-none bg-transparent ${
                value === opt ? 'text-primary-red font-semibold' : 'text-gray-950'
              }`}
            >
              Row {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
