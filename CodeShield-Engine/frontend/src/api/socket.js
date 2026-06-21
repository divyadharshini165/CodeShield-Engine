import { io } from 'socket.io-client';

// The Socket.io server is attached to the same Express HTTP server as the
// REST API (see backend/server.js), so it shares the host/port.
export const SOCKET_URL = 'http://localhost:5000';

let socket = null;

/**
 * Returns a shared, lazily-connected Socket.io client. Using a singleton
 * avoids opening a new WebSocket connection on every component mount.
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true
    });
  }
  return socket;
}
