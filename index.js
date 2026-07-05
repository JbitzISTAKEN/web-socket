const WebSocket = require('ws');
const server = new WebSocket.Server({ port: process.env.PORT || 10000 });

const users = new Map();   // ws → userId

function broadcastPlayerList() {
  const playerIds = [...users.values()];
  const message = JSON.stringify({
    type: 'players',
    players: playerIds
  });
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.on('connection', (ws) => {
  ws.on('message', (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      return;
    }

    if (msg.type === 'join' && typeof msg.userId === 'number') {
      // Store the socket <-> user mapping
      users.set(ws, msg.userId);
      broadcastPlayerList();
      console.log(`${msg.userId} joined. Total: ${users.size}`);
    }
  });

  ws.on('close', () => {
    users.delete(ws);
    broadcastPlayerList();
    console.log(`User left. Total: ${users.size}`);
  });
});
