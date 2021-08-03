const vscode = acquireVsCodeApi();

const canvas = document.getElementById('canvasEl');
const tempCanvas = document.getElementById('textCanvasEl');
const canvasContext = canvas.getContext('2d');
const tempCanvasContext = tempCanvas.getContext('2d');
const speakerOff = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTcgOXY2aDRsNSA1VjRsLTUgNUg3eiIvPjwvc3ZnPg==';
const speakerOn = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTMgOXY2aDRsNSA1VjRMNyA5SDN6bTEzLjUgM2MwLTEuNzctMS4wMi0zLjI5LTIuNS00LjAzdjguMDVjMS40OC0uNzMgMi41LTIuMjUgMi41LTQuMDJ6TTE0IDMuMjN2Mi4wNmMyLjg5Ljg2IDUgMy41NCA1IDYuNzFzLTIuMTEgNS44NS01IDYuNzF2Mi4wNmM0LjAxLS45MSA3LTQuNDkgNy04Ljc3cy0yLjk5LTcuODYtNy04Ljc3eiIvPjwvc3ZnPg==';

const speakers = {}
let volume = 0.5;
document.getElementById('volumneslider').oninput = (event) => {
    volume = Number.parseInt(event.target.value) / 100;
};

function exportByteCode() {

    vscode.postMessage({
        command: 'export'
    })
}
function clearInputs() {
   document.getElementById('digitalInputContainer').innerHTML = '';
   document.getElementById('analogInputContainer').innerHTML = '';
}

function addDigitalInput(id) {
    var input = document.createElement("INPUT");
    var label = document.createElement("LABEL");
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', 'digital' + id);
    input.setAttribute('name', 'digital' + id);
    label.setAttribute('for', 'digital' + id);
    label.innerText = 'Digital #' + id;
    var container = document.createElement("DIV");
    container.appendChild(input);
    container.appendChild(label);
    document.getElementById('digitalInputContainer').appendChild(container);

    input.onclick = (event) => {
        vscode.postMessage({
            command: 'digitalChanged',
            index: id,
            value: input.checked
        })
    };
}
function addAnalogInput(id) {
    var input = document.createElement("INPUT");
    var label = document.createElement("LABEL");
    input.setAttribute('type', 'range');
    input.setAttribute('id', 'analog' + id);
    input.setAttribute('name', 'analog' + id);
    input.setAttribute('min', 0);
    input.setAttribute('max', 1023);
    input.setAttribute('value', 512);

    label.setAttribute('for', 'analog' + id);
    label.innerText = 'Analog #' + id;
    var container = document.createElement("DIV");
    container.appendChild(input);
    container.appendChild(label);
    document.getElementById('analogInputContainer').appendChild(container);

    input.oninput = (event) => {
        vscode.postMessage({
            command: 'analogChanged',
            index: id,
            value: input.value
        })
    };
}
function clearSpeakers() {
    document.getElementById('speakersContainer').innerHTML = '';
}
function addSpeaker(id) {
    var img = document.createElement("IMG");
    img.setAttribute('src', speakerOff);
    img.setAttribute('class', 'off');
    document.getElementById('speakersContainer').appendChild(img);
    speakers[id] = {
        element: img,
        onUntil: 0
    };
} 
renderInstructions = [];

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'renderDone': {
            renderInstructions.forEach(r => {
                r();
            });
            renderInstructions = [];
            break;
        }
        case 'setInputs': {
            clearInputs();
            for(let i = 0; i < message.digitalInputs; i++) {
                addDigitalInput(i);
            }
            for(let i = 0; i < message.analogInputs; i++) {
                addAnalogInput(i);
            }
            break;
        }
        case 'setSpeakers': {
            clearSpeakers();
            for(let i = 0; i < message.speakers; i++) {
                addSpeaker(i);
            }
            break;
        }
        case 'setDimensions':
            canvas.setAttribute('width', message.width);
            canvas.setAttribute('height', message.height);
            tempCanvas.setAttribute('width', message.width);
            tempCanvas.setAttribute('height', message.height);
            setDimensions(message.width, message.height);
            break;
        case 'getPixel':
            const data = canvasContext.getImageData(
                message.x,
                message.y,
                1,
                1
            ).data;

            const color = (data[0] << 16) + (data[1] << 8) + (data[2]);
            vscode.postMessage({
                command: 'getPixelResult',
                color
            })
            break;
        case 'clear':
            renderInstructions.push(() => {
                clear();
            });
            break;
        case 'drawCircle':
            renderInstructions.push(() => {
                drawCircle(message.centerX, message.centerY, message.radius, message.color);
            });
            break;
        case 'fillCircle':
            renderInstructions.push(() => {
                fillCircle(message.centerX, message.centerY, message.radius, message.color);
            });
            break;
        case 'drawLine':
            renderInstructions.push(() => {
                drawLine(message.pos1X, message.pos1Y, message.pos2X, message.pos2Y, message.lineColor);
            });
            break;
        case 'drawPixel':
            renderInstructions.push(() => {
                drawPixel(message.x, message.y, message.pixelColor);
            });
            break;
        case 'drawRect':
            renderInstructions.push(() => {
                drawRect(message.topLeftDrawX, message.topLeftDrawY, message.width, message.height, message.drawRectColor);
            });
            break;
        case 'fillRect':
            renderInstructions.push(() => {
                fillRect(message.topLeftDrawX, message.topLeftDrawY, message.width, message.height, message.drawRectColor);
            });
            break;
        case 'drawText':
            renderInstructions.push(() => {
                drawText(message.pixelTextX, message.pixelTextY, message.scale, message.textColor, message.textvalue);
            });
            break;
        case 'drawImage':
            renderInstructions.push(() => {
                drawImage(message.x, message.y, message.w, message.h, message.keyColor, message.data);
            });
            break;
        case 'drawTriangle':
            renderInstructions.push(() => {
                drawTriangle(message.pixel1X, message.pixel1Y, message.pixel2X, message.pixel2Y, message.pixel3X, message.pixel3Y, message.triangleColor);
            });
            break;
        case 'fillTriangle':
            renderInstructions.push(() => {
                fillTriangle(message.pixel1X, message.pixel1Y, message.pixel2X, message.pixel2Y, message.pixel3X, message.pixel3Y, message.triangleColor);
            });
            break;
        case 'setRotation':
            renderInstructions.push(() => {
                setRotation(message.rotation);
            });
            break;
        case 'tone':
            beep(message.volume * volume, message.frequency, message.duration);
            const newTime = new Date().getTime() + message.duration;
            if(newTime > speakers[message.speaker].onUntil) {
                speakers[message.speaker].onUntil = new Date().getTime() + message.duration;
                speakers[message.speaker].element.setAttribute('src', speakerOn);
                speakers[message.speaker].element.setAttribute('class', 'on');

                setTimeout(() => {
                    if(speakers[message.speaker].onUntil <= new Date().getTime()) {
                        speakers[message.speaker].element.setAttribute('src', speakerOff);
                        speakers[message.speaker].element.setAttribute('class', 'off');
                    }
                }, message.duration + 10);
            }
            break;
    }
});
