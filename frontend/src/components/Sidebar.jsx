import { useState } from 'react';
import { createSession, deleteSession } from '../api/client';

export function Sidebar({ sessions, currentId, onNewChat, onSelectSession, onSessionsChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleNew = async () => {
    onNewChat();
    try {
      const session = await createSession();
      onSelectSession(session.id);
      onSessionsChange();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteSession(id);
      if (currentId === id) onNewChat();
      onSessionsChange();
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-border-dark bg-sidebar-dark transition-[width] ${
        collapsed ? 'w-[52px]' : 'w-64 md:w-72'
      }`}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border-dark px-3">
        {!collapsed && (
          <button
            onClick={handleNew}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-dark bg-transparent px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <PlusIcon className="h-4 w-4" />
            New chat
          </button>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rounded p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>
      {!collapsed && (
        <nav className="scrollbar-thin flex-1 overflow-y-auto py-2">
          {sessions.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-gray-500">No conversations yet</p>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`group flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                currentId === s.id ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800/70'
              }`}
            >
              <ChatIcon className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="min-w-0 flex-1 truncate">{s.title || 'New chat'}</span>
              <button
                onClick={(e) => handleDelete(e, s.id)}
                disabled={deletingId === s.id}
                className="shrink-0 rounded p-1 opacity-0 text-gray-400 hover:bg-gray-700 hover:text-red-400 group-hover:opacity-100 disabled:opacity-50"
                aria-label="Delete chat"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </button>
          ))}
        </nav>
      )}
    </aside>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
