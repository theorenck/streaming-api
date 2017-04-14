let io = require('socket.io-client')

let socket = io.connect('http://localhost:3000/zw15ser')

socket.on('change', function (data) {
  console.log(JSON.stringify(data,null,2));
})

let state = []

socket.on('initial', function (data) {
  state.push(data)
  if(state.length % 1000 == 0) console.log('.');
})

socket.on('state', function (data) {
  console.log(data.state);
  if(data.state === 'initializing') {
    console.log(process.memoryUsage())
    console.time('initializing')
  } else {
    console.timeEnd('initializing')
    console.log(process.memoryUsage())
    console.log(state.length);
  }
})
