import { createServer } from 'node:http';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 4000);
const app = createApp();
const server = createServer(app);

server.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
