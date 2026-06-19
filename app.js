const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

const port = process.env.PORT || 3001
let connects = []

app.use(express.static('public'))

app.ws('/ws', (ws, req) => {
  connects.push(ws)

  ws.on('message', (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage);
      console.log(`[${data.user}]: ${data.message}`);
    } catch (e) {
      console.log('JSONではないデータを受信:', rawMessage);
    }

    connects.forEach((socket) => {
      if (socket.readyState === 1) {
        socket.send(rawMessage);
      }
    });
  });
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})