import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + K = Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.location.hash = '#search';
      }

      // Ctrl/Cmd + B = Cart
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        window.location.hash = '#cart';
      }

      // Ctrl/Cmd + H = Home
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        window.location.hash = '#';
      }

      // ESC = Go back to home
      if (e.key === 'Escape' && window.location.hash !== '') {
        window.location.hash = '#';
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
}

export function KeyboardShortcutsHelp() {
  return (
    <div className="fixed bottom-4 left-4 z-40 hidden md:block opacity-50 hover:opacity-100 transition-opacity">
      <details className="frosted-glass border border-white/30 rounded-sm p-3">
        <summary className="uppercase-headline cursor-pointer" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
          SHORTCUTS
        </summary>
        <div className="mt-2 space-y-1" style={{ fontSize: '10px' }}>
          <div className="flex gap-2">
            <kbd className="px-2 py-0.5 bg-[#262930]/10 rounded">⌘/Ctrl K</kbd>
            <span>Search</span>
          </div>
          <div className="flex gap-2">
            <kbd className="px-2 py-0.5 bg-[#262930]/10 rounded">⌘/Ctrl B</kbd>
            <span>Cart</span>
          </div>
          <div className="flex gap-2">
            <kbd className="px-2 py-0.5 bg-[#262930]/10 rounded">⌘/Ctrl H</kbd>
            <span>Home</span>
          </div>
          <div className="flex gap-2">
            <kbd className="px-2 py-0.5 bg-[#262930]/10 rounded">ESC</kbd>
            <span>Back</span>
          </div>
        </div>
      </details>
    </div>
  );
}
