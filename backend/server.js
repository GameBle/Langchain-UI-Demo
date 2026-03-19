import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { chatRoutes } from './routes/chat.js';
import { setupWebSocket } from './controllers/websocket.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api', chatRoutes);

const httpServer = createServer(app);
setupWebSocket(httpServer);

const HOST = '0.0.0.0';
httpServer.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
