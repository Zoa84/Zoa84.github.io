//Enums for the different portfolio image gallerys
var ImgEnum = {
    aiImg: 101,
    leapImg: 102,
    lickImg: 103,
}

var iNextImgTime = 3000;            //Time until the next image (milliseconds)

var aiImgs = [];                    //Array of all images for Annihilation Intelligence
var aiCurrentImg = 0;               //The currently shown image
aiImgs[0] = "./images/ai1.png";     //The image locations
aiImgs[1] = "./images/ai2.png";
aiImgs[2] = "./images/ai3.png";

var leapImgs = [];                  //Array of all images for Leap Engine
var leapCurrentImg = 0;
leapImgs[0] = "./images/leap1.png";
leapImgs[1] = "./images/leap2.png";
leapImgs[2] = "./images/leap3.png";

var lickImgs = [];                  //Array of all images for Lick's Cavern
var lickCurrentImg = 0;
lickImgs[0] = "./images/lick1.jpg";
lickImgs[1] = "./images/lick2.jpg";
lickImgs[2] = "./images/lick3.jpg";

//Show the next image for all portfolio image gallerys
function NextImage() {
    aiCurrentImg++;
    if (aiCurrentImg > aiImgs.length - 1) {
        aiCurrentImg = 0;
    }
    document.getElementById("aiIMG").src = aiImgs[aiCurrentImg];

    leapCurrentImg++;
    if (leapCurrentImg > leapImgs.length - 1) {
        leapCurrentImg = 0;
    }
    document.getElementById("leapIMG").src = leapImgs[leapCurrentImg];

    lickCurrentImg++;
    if (lickCurrentImg > lickImgs.length - 1) {
        lickCurrentImg = 0;
    }
    document.getElementById("lickIMG").src = lickImgs[lickCurrentImg];
}

//Start cycling for all image gallerys
function StartCycleImgs() {
    setInterval(NextImage, iNextImgTime);
}
