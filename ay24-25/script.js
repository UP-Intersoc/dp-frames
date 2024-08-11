const captionTemplate = `
$ 𝚙𝚠𝚍
/𝚑𝚘𝚖𝚎/𝚜𝚝𝚞𝚍𝚎𝚗𝚝/𝙺𝙾𝙼𝚂𝙰𝙸
$ 𝚖𝚔𝚍𝚒𝚛 𝙰𝚈𝟸𝟺-𝟸𝟻
$ 𝚌𝚍 𝙰𝚈𝟸𝟺-𝟸𝟻 


Eyyy 🤙 I’m in… 🥷💻 in a new academic year as a <year/> B.S. in Computer Science student of UP Tacloban! 

I’m <name/>! Come along with me 🎵 and the butterflies 🦋 and bees 🐝 (figuratively 😜) as we wander through the evolution of analog and digital technologies that define the modern age and the future. 

‘Di ko man kaya i-h4ck ang FB Chats ng jowa mo or ayusin ang printer mo (actually kaya naman kung pag-aralan 😝)— as an Iskolar ng Bayan, I’m ready to learn and apply the knowledge and skills in the field of computing in order to solve the challenges from within the four walls of my classroom to the societal problems lying beyond these walls. ✊ 


𝚃𝚢𝚙𝚎 𝚊 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚝𝚘 𝚙𝚊𝚍𝚊𝚢𝚘𝚗… 🤖💾 

$ 

#UPTacloban
#AY2425
#KOMSAI 

-

🎨 Nikka Naputo
✍ Joenne Amancio
`.trim();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const inputs = {
    circular: document.querySelector("[name='circular']"),
    image: document.querySelector("[name='image']"),
    name: document.querySelector("[name='name']"),
    year: document.querySelector("[name='year']"),
    caption: document.querySelector("[name='caption']"),
};

const buttons = {
    upload: document.querySelector("[name='upload']"),
    downloadDP: document.querySelector("[name='download_dp']"),
    copyCaption: document.querySelector("[name='copy_caption']"),
    imageAdjust: {
        up: document.querySelector("[name='image_up']"),
        down: document.querySelector("[name='image_down']"),
        left: document.querySelector("[name='image_left']"),
        right: document.querySelector("[name='image_right']"),
        zoomIn: document.querySelector("[name='image_zoomin']"),
        zoomOut: document.querySelector("[name='image_zoomout']"),
    }
};

const imageAdjustStates = {
    initialHeight: height,
    initialWidth: width,
    zoom: 1,
    x: 0,
    y: 0
};

const images = {
    frame: new Image(),
    image: new Image()
};

async function redrawDP() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#004771";
    ctx.fillRect(0, 0, width, height);

    // Draw image
    if(images.image) {
        const { initialWidth, initialHeight, x, y, zoom } = imageAdjustStates;
        ctx.drawImage(images.image, x, y,
            initialWidth*zoom, 
            initialHeight*zoom);
    }
    
    // Draw frame
    ctx.drawImage(images.frame, 0, 0, width, height);
}

function moveImage(xOffset, yOffset) {
    imageAdjustStates.x += xOffset;
    imageAdjustStates.y += yOffset;

    redrawDP();
}

function zoomImage(scale) {
    const xOffset = (scale - 1)*imageAdjustStates.zoom*imageAdjustStates.initialWidth;
    const yOffset = (scale - 1)*imageAdjustStates.zoom*imageAdjustStates.initialHeight;

    imageAdjustStates.zoom *= scale;
    imageAdjustStates.x -= xOffset / 2;
    imageAdjustStates.y -= yOffset / 2;

    redrawDP();
}

function loadFrameFile() {
    const image = new Image();
    image.src = "./frame.png";
    images.frame = image;
    image.onload = function() {
        redrawDP();
    };
}

function loadUploadedFile() {
    const reader = new FileReader();
    reader.onload = function(e) {
        const image = new Image();
        image.src = e.target.result;
        image.onload = function() {
            // Reset image adjustment states
            const minSize = width * 0.7;
            
            if(image.width <= image.height) {
                imageAdjustStates.initialWidth = minSize;
                imageAdjustStates.initialHeight = image.height * (minSize / image.width);
            } else {
                imageAdjustStates.initialHeight = minSize;
                imageAdjustStates.initialWidth = image.width * (minSize / image.height);
            }

            imageAdjustStates.x = (width - imageAdjustStates.initialWidth)/2;
            imageAdjustStates.y = (height - imageAdjustStates.initialHeight)/2;
            imageAdjustStates.zoom = 1;

            images.image = image;
            redrawDP();
        };
    }

    reader.readAsDataURL(inputs.image.files[0]);
}

function toggleCircular() {
    const isCircular = inputs.circular.checked;
    if(isCircular) canvas.classList.add("circular");
    else canvas.classList.remove("circular");

}

function getCaption () {
    const name = inputs.name.value?.trim();
    const year = inputs.year.value?.trim();

    if(!name) return "";

    return captionTemplate
        .replace("<name/>", name)
        .replace("<year/>", year);
}

function refreshCaption() {
    inputs.caption.value = getCaption();
}

function downloadImage() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `generated-upintersoc2425-${Date.now()}.png`;
    link.click();
}

function copyCaption() {
    navigator.clipboard.writeText(getCaption()).then(() => {
        alert("Copied!");
    }).catch(err => {
        alert("Cannot copy the caption. Manually copy it from the text field.")
    });
}

window.onload = function() {
    loadFrameFile();

    inputs.circular.addEventListener("change", () => toggleCircular());
    inputs.image.addEventListener("change", () => loadUploadedFile());
    inputs.name.addEventListener("input", () => refreshCaption());
    inputs.year.addEventListener("change", () => refreshCaption());

    const moveMagnitude = 5;
    const zoomMagnitude = 1.05;

    buttons.upload.addEventListener("click", ()=> inputs.image.click());
    buttons.downloadDP.addEventListener("click", ()=> downloadImage());
    buttons.copyCaption.addEventListener("click", ()=> copyCaption());
    
    buttons.imageAdjust.up.addEventListener("click", () => moveImage(0, -moveMagnitude));
    buttons.imageAdjust.down.addEventListener("click", () => moveImage(0, moveMagnitude));
    buttons.imageAdjust.left.addEventListener("click", () => moveImage(-moveMagnitude, 0));
    buttons.imageAdjust.right.addEventListener("click", () => moveImage(moveMagnitude, 0));

    buttons.imageAdjust.zoomIn.addEventListener("click", () => zoomImage(zoomMagnitude));
    buttons.imageAdjust.zoomOut.addEventListener("click", () => zoomImage(1/zoomMagnitude));
};