import { useRef, useEffect } from 'react';
import { MessageBubble } from '../components/MessageBubble';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ChatInput } from '../components/ChatInput';
import { ThemeToggle } from '../components/ThemeToggle';

export function ChatPage({ session, messages, onSend, loading, connected }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isStreaming = messages.some((m) => m.role === 'assistant' && m.content && messages[messages.length - 1]?.id === m.id);
  const showLoading = messages.length > 0 && messages[messages.length - 1]?.role === 'user' && !isStreaming;

  return (
    <main className="flex flex-1 flex-col min-w-0">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4 dark:border-border-dark">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h1 className="truncate text-sm font-medium text-gray-900 dark:text-gray-300">
            {session?.title || 'New chat'}
          </h1>
          {connected && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" title="Connected" />
          )}
        </div>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-gray-800">
                <ChatIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-300">Start a conversation</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-500">
                Send a message or create a new chat from the sidebar.
              </p>
            </div>
          )}
          {loading && messages.length === 0 && (
            <div className="flex justify-center py-8">
              <LoadingIndicator />
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="mb-4">
              <MessageBubble message={msg} />
            </div>
          ))}
          {showLoading && (
            <div className="mb-4">
              <LoadingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={onSend} disabled={!connected} placeholder="Message…" />
    </main>
  );
}

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}
