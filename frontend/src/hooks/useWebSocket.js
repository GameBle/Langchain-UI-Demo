import { useRef, useEffect, useCallback, useState } from 'react';

const getWsUrl = () => {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = import.meta.env.DEV ? window.location.host : window.location.host;
  return `${proto}//${host}/ws`;
};

export function useWebSocket({ onMessage, onSession } = {}) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  const onSessionRef = useRef(onSession);
  onMessageRef.current = onMessage;
  onSessionRef.current = onSession;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return wsRef.current;
    const url = getWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'session' && onSessionRef.current) onSessionRef.current(data.session);
        if (onMessageRef.current) onMessageRef.current(data);
      } catch (_) {}
    };
    return ws;
  }, []);

  const send = useCallback((payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const sendChat = useCallback((sessionId, content) => {
    send({ type: 'chat', sessionId: sessionId || null, content });
  }, [send]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connected, send, sendChat, connect, disconnect };
}
