export function LoadingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex max-w-[85%] items-center gap-2 rounded-2xl border border-border-dark bg-bubble-aiDark px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
        </div>
      </div>
    </div>
  );
}
