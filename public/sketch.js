
var socket = io.connect('http://localhost:3000');

window.onload = () => {
    setup();
}

function setup() {
    let mode = false;
    let canvas = document.getElementById('painter');
    var ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', () => {
        mode = true;
    });
    canvas.addEventListener('mouseup', () => {
        mode = false;
        canvas.style.cursor = 'default';
    });
    canvas.addEventListener('mousemove', (e) => {
        var cordinates = getMouseCords(canvas, e);
        canvas.style.cursor = 'pointer';
        draw(ctx, cordinates.x, cordinates.y, mode);
    });

    socket.on('draw', data => {
        canvas.style.cursor = 'pointer';
        draw(ctx, data.x, data.y, true);
    });

}

function getMouseCords(canvas, event) {
    var boundingRect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundingRect.left,
        y: event.clientY - boundingRect.top
    }
}

function draw(ctx, x, y, mode) {
    if (mode) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x, y, 4, 4);
        socket.emit('draw', { x: x, y: y, color: '#FF0000' });
    }
}
