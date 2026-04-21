import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' },
  connectionStateRecovery: {}
});

const db = await open({
  filename: './chatify.db',
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
  )
`);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', async (socket) => {
  console.log('a user connected', socket.id);

  if (!socket.recovered) {
    try {
      await db.each(
        'SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  socket.on('chat message', async (msg) => {
    console.log('message: ' + msg);
    let result;
    try {
      result = await db.run('INSERT INTO messages (content) VALUES (?)', [msg]);
    } catch (e) {
      console.error(e);
      return;
    }
    io.emit('chat message', msg, result.lastID);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
