import {
  createSession,
  getSession,
  listSessions,
  updateSession,
  deleteSession,
  getConversation,
  appendMessage,
} from '../store/sessions.js';

export function createChatSession(req, res) {
  const session = createSession();
  res.status(201).json(session);
}

export function getChatSessions(req, res) {
  const sessions = listSessions();
  res.json(sessions);
}

export function getChatSession(req, res) {
  const { id } = req.params;
  const session = getSession(id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const messages = getConversation(id);
  res.json({ ...session, messages });
}

export function updateChatSession(req, res) {
  const { id } = req.params;
  const session = updateSession(id, req.body);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
}

export function removeChatSession(req, res) {
  const { id } = req.params;
  const ok = deleteSession(id);
  if (!ok) return res.status(404).json({ error: 'Session not found' });
  res.status(204).send();
}

export function getMessages(req, res) {
  const { sessionId } = req.params;
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const messages = getConversation(sessionId);
  res.json(messages);
}

export function addMessage(req, res) {
  const { sessionId } = req.params;
  const { role, content } = req.body;
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (!role || !content) return res.status(400).json({ error: 'role and content required' });
  const message = {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: Date.now(),
  };
  appendMessage(sessionId, message);
  if (session.title === 'New chat' && role === 'user') {
    const short = content.slice(0, 50).replace(/\n/g, ' ');
    updateSession(sessionId, { title: short + (content.length > 50 ? '...' : '') });
  }
  res.status(201).json(message);
}
