
let express = require('express');
let socket = require('socket.io');
let app = express();

app.use(express.static('public'));
let server = app.listen(3000);

let io = socket(server);

io.sockets.on('connection', socket => {
    console.log('new conncetion:' + socket.id);
    socket.on('draw', data => {
        console.log(data);
        socket.broadcast.emit('drawPub', data);
    });
    socket.on('trunOffPaintMode', () => {
        socket.broadcast.emit('trunOffPaintMode');
    });

});

console.log('Server is running..');