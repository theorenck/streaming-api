let r = require('rethinkdb')
let jiff = require('jiff')

let app = require('express')()
let server = require('http').createServer(app)
let io = require('socket.io')(server)

let port = process.env.PORT || 3000;

app.disable('etag')

let zw15ser = io.of('/zw15ser')

app.get('/', (req, res) => {
  res.sendStatus(200)
});

zw15ser.on('connection', (socket) => {
  r.connect({
    db: 'test'
  })
  .then(conn => {
    r.table('zw15ser')
    .pluck([
      'codservico',
      'cliente',
      'aberto'
    ])
    .changes({
      includeInitial: true,
      includeStates: true,
      includeTypes: true
    })
    .run(conn).then(cursor => {
      cursor.each((error, data) => {
        if (error) {
          console.error(error)
          return
        }
        let { type, old_val, new_val, state } = data

        switch (type) {
          case 'add':
            break
          case 'remove':
            break
          case 'change':
            console.log(type)
            let patches = jiff.diff(old_val, new_val, { invertible: false })
            zw15ser.emit(type, {patches})
            break
          case 'initial':
            // console.log(JSON.stringify(data,null,2));
            zw15ser.emit(type, new_val)
            break
          case 'uninitial':
              break
          case 'state':
              zw15ser.emit(type, {state})
              break
          default:
            console.log(data)
            break
        }
      });
    }).error(({message}) => console.error(message))
  }).error(({message}) => console.error(message))
})

server.listen(port,'0.0.0.0')
