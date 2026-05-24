const { PeerServer } = require('peer');

const peerServer = PeerServer({
  port: process.env.PORT || 10000,
  host: '0.0.0.0',
  path: '/'
});

console.log('PeerJS server running!');
