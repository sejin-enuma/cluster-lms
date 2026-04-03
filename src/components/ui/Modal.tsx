import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-[8px] shadow-xl w-[400px] max-w-[90vw]">
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-line">
          <h3 className="text-[16px] font-semibold text-gray-950 m-0">{title}</h3>
          <button
            onClick={onClose}
            className="w-[24px] h-[24px] flex items-center justify-center border-none bg-transparent cursor-pointer text-gray-500 hover:text-gray-950"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-[24px] py-[20px] text-[14px] text-gray-700">
          {children}
        </div>
        {actions && (
          <div className="flex items-center justify-end gap-[8px] px-[24px] py-[16px] border-t border-line">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
