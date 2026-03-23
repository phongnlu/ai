'use client';
import { useState } from 'react';

interface NavTooltipProps {
  label: string;
  children: React.ReactNode;
  show?: boolean;
  align?: 'center' | 'right';
  onAdvance?: () => void;
  hoverDisabled?: boolean;
}

export default function NavTooltip({ label, children, show = false, align = 'center', onAdvance, hoverDisabled = false }: NavTooltipProps) {
  const [hovered, setHovered] = useState(false);
  const visible = show || (!hoverDisabled && hovered);

  const tooltipPos = align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const arrowPos = align === 'right' ? 'right-3' : 'left-1/2 -translate-x-1/2';

  const handleTap = () => {
    setHovered(false);
    if (show && onAdvance) onAdvance();
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTap}
      onClick={show ? onAdvance : undefined}
    >
      {children}
      <div
        className={`absolute top-full ${tooltipPos} mt-2 px-2 py-1 rounded-md text-xs whitespace-nowrap
          bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow pointer-events-none z-50
          transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
      >
        {label}
        <div className={`absolute -top-1 ${arrowPos} w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45`} />
      </div>
    </div>
  );
}
