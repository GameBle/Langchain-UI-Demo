import { Router } from 'express';
import {
  createChatSession,
  getChatSessions,
  getChatSession,
  updateChatSession,
  removeChatSession,
  getMessages,
  addMessage,
} from '../controllers/chat.js';

export const chatRoutes = Router();

chatRoutes.post('/sessions', createChatSession);
chatRoutes.get('/sessions', getChatSessions);
chatRoutes.get('/sessions/:id', getChatSession);
chatRoutes.patch('/sessions/:id', updateChatSession);
chatRoutes.delete('/sessions/:id', removeChatSession);
chatRoutes.get('/sessions/:sessionId/messages', getMessages);
chatRoutes.post('/sessions/:sessionId/messages', addMessage);
