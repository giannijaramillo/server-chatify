# Chatify Server

Servidor backend para Chatify, una aplicación de chat en tiempo real construida con Node.js, Socket.io y SQLite.

## 🚀 Demo
Servidor desplegado en Railway: https://server-chatify-production-a239.up.railway.app

## 🛠️ Tecnologías
- Node.js
- Express
- Socket.io
- SQLite (persistencia de mensajes)

## ⚙️ Instalación local

```bash
git clone https://github.com/giannijaramillo/server-chatify.git
cd server-chatify
npm install
node index.js
```

El servidor corre en `http://localhost:3000`

## 📡 Funcionalidades
- Conexión en tiempo real con Socket.io
- Persistencia de mensajes con SQLite
- Recuperación de mensajes al reconectar (connectionStateRecovery)
- Los mensajes se guardan en `chatify.db` automáticamente al iniciar

## 🔌 Eventos Socket.io
| Evento | Descripción |
|--------|-------------|
| `chat message` (recibe) | Guarda el mensaje en DB y lo emite a todos los clientes |
| `chat message` (emite) | Envía el mensaje y su ID a todos los clientes conectados |
| `disconnect` | Registra cuando un usuario se desconecta |
