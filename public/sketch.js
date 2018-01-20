
function setGlobalVariable() {
    socket = io.connect('http://localhost:3000');
    mode = false;
    canvas = document.getElementById('painter');
}

window.onload = () => {
    setGlobalVariable();
    init();
};

function init() {
    initCanvasListeners();
    initSocketListeners();
    initBodyListeners();
    setupCanvas(canvas.getContext('2d'));
}

function initCanvasListeners() {
    var events = ['mousedown', 'mousemove', 'mouseup', 'mouseout'];
    events.forEach((event) => {
        canvas.addEventListener(event, (e) => {
            let mouseCords = getMouseCords(e);
            draw(canvas.getContext('2d'), e.type, mouseCords, true);
        }, event === 'mouseup' | event === 'mouseout' ? true : false);
    });
}
function initSocketListeners() {
    socket.on('drawPub', data => {
        canvas.getContext('2d').strokeStyle = data.color;
        mode = true;
        draw(canvas.getContext('2d'), data.event, data.cords, false);
    });
    socket.on('trunOffPaintMode', () => {
        mode = false;
    });
}
function initBodyListeners() {
    document.getElementsByTagName('body')[0].addEventListener('mouseout', () => {
        socket.emit('trunOffPaintMode',true);
    });
}

function setupCanvas(ctx) {
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "solid";
    ctx.strokeStyle = "#bada55";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
}

function getMouseCords(event) {
    var boundingRect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundingRect.left,
        y: event.clientY - boundingRect.top
    }
}

function draw(ctx, eventType, cords, publishDraw) {
    switch (eventType) {
        case 'mousedown':
            mode = true;
            ctx.beginPath();
            ctx.moveTo(cords.x, cords.y);
            if (publishDraw)
                socket.emit('draw', { cords: { x: cords.x, y: cords.y }, color: ctx.strokeStyle, event: 'mousedown' });
            break;
        case 'mousemove':
            if (mode) {
                console.log(mode);
                ctx.lineTo(cords.x, cords.y);
                ctx.stroke();
                if (publishDraw)
                    socket.emit('draw', { cords: { x: cords.x, y: cords.y }, color: ctx.strokeStyle, event: 'mousemove' });
            }
            break;
        default:
            mode = false;
            console.log(mode);
            ctx.closePath();
            break;
    }
}
