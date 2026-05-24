const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const server = http.createServer(app);

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: true,
});

app.use('/', peerServer);

// Waiting room - store one waiting peer ID
let waitingPeerId = null;

app.get('/waiting', (req, res) => {
  res.json({ waitingPeerId });
});

app.post('/waiting', express.json(), (req, res) => {
  waitingPeerId = req.body.peerId || null;
  res.json({ ok: true });
});

app.delete('/waiting', (req, res) => {
  waitingPeerId = null;
  res.json({ ok: true });
});

peerServer.on('connection', (client) => {
  console.log('Connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Disconnected:', client.getId());
  if (waitingPeerId === client.getId()) {
    waitingPeerId = null;
    console.log('Cleared waiting room');
  }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
