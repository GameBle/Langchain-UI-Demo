import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatPage } from './pages/ChatPage';
import { getSessions, createSession, getSession } from './api/client';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const list = await getSessions();
      setSessions(list);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleNewChat = useCallback(async () => {
    setCurrentSession(null);
    setMessages([]);
  }, []);

  const handleSelectSession = useCallback(async (id) => {
    setLoading(true);
    try {
      const session = await getSession(id);
      setCurrentSession(session);
      setMessages(session.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'user_message') {
      setMessages((prev) => [...prev, data.message]);
    }
    if (data.type === 'start') {
      setCurrentSession((prev) => (prev ? { ...prev, id: data.id } : { id: data.id, title: 'New chat', messages: [] }));
    }
    if (data.type === 'chunk') {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === 'assistant' && last?.id === data.id) {
          copy[copy.length - 1] = { ...last, content: last.content + data.content };
          return copy;
        }
        copy.push({ id: data.id, role: 'assistant', content: data.content || '' });
        return copy;
      });
    }
    if (data.type === 'done') {
      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((m) => m.id === data.message.id);
        if (idx >= 0) copy[idx] = data.message;
        else copy.push(data.message);
        return copy;
      });
      loadSessions();
    }
    if (data.type === 'session') {
      setCurrentSession(data.session);
      setMessages([]);
      loadSessions();
    }
  }, [loadSessions]);

  const { sendChat, connected } = useWebSocket({
    onMessage: handleWebSocketMessage,
  });

  const handleSend = useCallback(
    (content) => {
      if (!content.trim()) return;
      sendChat(currentSession?.id || null, content.trim());
    },
    [currentSession?.id, sendChat]
  );

  return (
    <div className="flex h-full bg-surface-dark">
      <Sidebar
        sessions={sessions}
        currentId={currentSession?.id}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onSessionsChange={loadSessions}
      />
      <ChatPage
        session={currentSession}
        messages={messages}
        onSend={handleSend}
        loading={loading}
        connected={connected}
      />
    </div>
  );
}
