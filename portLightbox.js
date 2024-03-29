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

var modal = document.getElementById("modal");           //The modal div in portfolio.html
var span = document.getElementsByClassName("close")[0]; //The cross button to exit modal
var modalImg = document.getElementById("modalIMG")      //The image shown in the modal gallery
var currentModalImg;                //The current portfolio image open in the modal gallery

//Show the next image for all portfolio image gallerys
function NextImage() {
    //Stop changing the image if the modal gallery is open
    if (modal.style.display != "block") {
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
}

//Start cycling for all image gallerys
function StartCycleImgs() {
    setInterval(NextImage, iNextImgTime);
}

//Open the modal gallery, passing which portfolio piece to open
function OpenModal(imgEnum) {
    switch (imgEnum) {
        case ImgEnum.aiImg:
            modalImg.src = aiImgs[aiCurrentImg];
            currentModalImg = ImgEnum.aiImg;
            break;
        case ImgEnum.leapImg:
            modalImg.src = leapImgs[leapCurrentImg];
            currentModalImg = ImgEnum.leapImg;
            break;
        case ImgEnum.lickImg:
            modalImg.src = lickImgs[lickCurrentImg];
            currentModalImg = ImgEnum.lickImg;
            break;
    }

    modal.style.display = "block";  //Display the modal, usually set as 'none' to be hidden
}

//Close the modal gallery if the close button is clicked
span.onclick = function () {
    modal.style.display = "none";
}

//Close the modal gallery if outside the gallery is clicked
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//Load the next image in the modal gallery for the currently selected portfolio image
function NextModalImage() {
    switch (currentModalImg) {
        case ImgEnum.aiImg:
            aiCurrentImg++;
            if (aiCurrentImg > aiImgs.length - 1) {
                aiCurrentImg = 0;
            }
            document.getElementById("aiIMG").src = aiImgs[aiCurrentImg];
            modalImg.src = aiImgs[aiCurrentImg];
            break;
        case ImgEnum.leapImg:
            leapCurrentImg++;
            if (leapCurrentImg > leapImgs.length - 1) {
                leapCurrentImg = 0;
            }
            document.getElementById("leapIMG").src = leapImgs[leapCurrentImg];
            modalImg.src = leapImgs[leapCurrentImg];
            break;
        case ImgEnum.lickImg:
            lickCurrentImg++;
            if (lickCurrentImg > lickImgs.length - 1) {
                lickCurrentImg = 0;
            }
            document.getElementById("lickIMG").src = lickImgs[lickCurrentImg];
            modalImg.src = lickImgs[lickCurrentImg];
            break;
    }
}