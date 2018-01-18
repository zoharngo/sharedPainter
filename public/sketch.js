var socket;

function setup() {
    createCanvas(600, 400);
    background(51);

    socket = io.connect('http://localhost:3000');
    socket.on('draw', data => {
        noStroke();
        fill(data.color.r, data.color.g, data.color.b);
        ellipse(data.x, data.y, 5, 5);
    });
}

function mouseDragged() {
    console.log(mouseX + ',' + mouseY);
    noStroke();
    fill(255,0,100);
    ellipse(mouseX, mouseY, 5, 5);
    socket.emit('draw', { x: mouseX, y: mouseY, color: { r: 255, g: 0, b: 100 } });
}