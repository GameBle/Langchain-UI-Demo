import { WebSocketServer } from 'ws';
import {
  getSession,
  getConversation,
  appendMessage,
  updateSession,
  createSession,
} from '../store/sessions.js';

function simulateStreamingResponse(sessionId, userContent, send) {
  const aiId = crypto.randomUUID();
  const words = [
    "I'm",
    ' a',
    ' simulated',
    ' AI',
    ' response.',
    ' This',
    ' text',
    ' streams',
    ' in',
    ' real',
    ' time.',
    ' You',
    ' asked:',
    ' "',
    ...userContent.slice(0, 80).split(''),
    '"',
    '.',
    ' Feel',
    ' free',
    ' to',
    ' replace',
    ' this',
    ' with',
    ' a',
    ' real',
    ' LLM',
    ' integration',
    ' later.',
  ];
  let fullContent = '';
  let i = 0;
  const tick = () => {
    if (i < words.length) {
      fullContent += words[i];
      send({ type: 'chunk', id: aiId, content: words[i] });
      i++;
      setTimeout(tick, 30 + Math.random() * 40);
    } else {
      const message = {
        id: aiId,
        role: 'assistant',
        content: fullContent,
        createdAt: Date.now(),
      };
      appendMessage(sessionId, message);
      send({ type: 'done', message });
    }
  };
  tick();
}

export function setupWebSocket(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');

    const send = (data) => {
      if (ws.readyState === 1) ws.send(JSON.stringify(data));
    };

    ws.on('message', (raw) => {
      try {
        const payload = JSON.parse(raw.toString());
        if (payload.type === 'chat') {
          const { sessionId: sid, content } = payload;
          let effectiveSessionId = sid;
          if (!effectiveSessionId) {
            const session = createSession();
            effectiveSessionId = session.id;
            send({ type: 'session', session });
          }
          const session = getSession(effectiveSessionId);
          if (!session) {
            send({ type: 'error', error: 'Session not found' });
            return;
          }
          const userMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            createdAt: Date.now(),
          };
          appendMessage(effectiveSessionId, userMessage);
          if (session.title === 'New chat') {
            const short = content.slice(0, 50).replace(/\n/g, ' ');
            updateSession(effectiveSessionId, {
              title: short + (content.length > 50 ? '...' : ''),
            });
          }
          send({ type: 'user_message', message: userMessage });
          send({ type: 'start', id: effectiveSessionId });
          simulateStreamingResponse(effectiveSessionId, content, send);
        }
      } catch (e) {
        send({ type: 'error', error: e.message });
      }
    });

    ws.on('close', () => {});
  });
}
