import { useState, useRef, useEffect } from 'react';

export function ChatInput({ onSend, disabled, placeholder = 'Message…' }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [value]);

  return (
    <div className="border-t border-border-dark bg-surface-dark p-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border-dark bg-sidebar-dark px-3 py-2 focus-within:ring-1 focus-within:ring-gray-500">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={send}
          disabled={disabled || !value.trim()}
          className="shrink-0 rounded-lg bg-gray-600 p-2 text-white hover:bg-gray-500 disabled:opacity-40 disabled:hover:bg-gray-600"
          aria-label="Send message"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
