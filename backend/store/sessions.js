const sessions = new Map();
const sessionIdToConversations = new Map();

export function createSession() {
  const id = crypto.randomUUID();
  const session = {
    id,
    title: 'New chat',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  sessions.set(id, session);
  sessionIdToConversations.set(id, []);
  return session;
}

export function getSession(id) {
  return sessions.get(id);
}

export function listSessions() {
  return Array.from(sessions.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function updateSession(id, updates) {
  const session = sessions.get(id);
  if (!session) return null;
  Object.assign(session, updates, { updatedAt: Date.now() });
  return session;
}

export function deleteSession(id) {
  sessions.delete(id);
  sessionIdToConversations.delete(id);
  return true;
}

export function getConversation(sessionId) {
  return sessionIdToConversations.get(sessionId) ?? [];
}

export function appendMessage(sessionId, message) {
  let messages = sessionIdToConversations.get(sessionId);
  if (!messages) {
    messages = [];
    sessionIdToConversations.set(sessionId, messages);
  }
  messages.push(message);
  const session = sessions.get(sessionId);
  if (session) session.updatedAt = Date.now();
  return messages;
}

export function setConversation(sessionId, messages) {
  sessionIdToConversations.set(sessionId, messages);
  const session = sessions.get(sessionId);
  if (session) session.updatedAt = Date.now();
}
