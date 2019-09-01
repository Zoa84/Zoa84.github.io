var iNextImgTime = 3000;

var aiImgs = [];
var aiCurrentImg = 0;
aiImgs[0] = "./images/ai1.png";
aiImgs[1] = "./images/ai2.png";
aiImgs[2] = "./images/ai3.png";

function NextImage() {
    aiCurrentImg++;
    if (aiCurrentImg > aiImgs.length - 1) {
        aiCurrentImg = 0;
    }
    document.getElementById("aiIMG").src = aiImgs[aiCurrentImg];
}

function StartCycleImgs() {
    setInterval(NextImage, iNextImgTime);
}
