export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-bubble-user text-gray-100'
            : 'border border-border bg-bubble-ai text-gray-800 dark:border-border-dark dark:bg-bubble-aiDark dark:text-gray-200'
        }`}
      >
        <div className="message-content whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}
