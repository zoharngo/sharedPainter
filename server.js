
var express = require('express');

var app = express();

var server = app.listen(3000);

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', socket => {
    console.log('new conncetion:' + socket.id);
    socket.on('draw', data => {
        console.log(data);
        socket.broadcast.emit('draw', data);
    });

});

console.log('Server is running..');