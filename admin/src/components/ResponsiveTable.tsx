import { ReactNode } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden md:block">
        {children}
      </div>
      {/* Mobile/Tablet view with horizontal scroll */}
      <div className="block md:hidden">
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="min-w-[640px]">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
