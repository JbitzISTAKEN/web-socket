const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
    res.end("WebSocket running");
});

const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("message", (msg) => {
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
    });
});

server.listen(PORT, "0.0.0.0");
