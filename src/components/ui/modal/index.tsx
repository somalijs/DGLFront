import FormSpinner from '@/assets/spinners/FormSpinner';
import { SquareX } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  outSideClose?: boolean;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
  loading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  outSideClose = false,
  children,
  title,
  className,
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
  loading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? 'w-full h-full'
    : 'relative w-full rounded-xl bg-white  dark:bg-gray-900';

  return (
    <div className='fixed inset-0 dark:text-white text:black  flex justify-center modal z-99 h-fit  pt-20 px-2'>
      {!isFullscreen && (
        <div
          className='fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]'
          onClick={outSideClose ? onClose : undefined}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses}  ${className} relative `}
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <FormSpinner />}
        <header className='flex justify-between items-center'>
          {title}
          {showCloseButton && (
            <SquareX
              onClick={onClose}
              className={`cursor-pointer hover:text-red-500`}
            />
          )}
        </header>
        <div className='mt-10'>{children}</div>
      </div>
    </div>
  );
};
