//The states the game can be in
const state = {
    PAY: 1001,
    SELECTION: 1002,
    ROLLING: 1003,
    END: 1004,
}

//Enums for all texts
const text = {
    CHOOSE_TEXT: 0,
    PLAYER_MONEY: 1,
    PLAYER_BET: 2,
    PLAYER_NUMS: 3,
    PICK_TEXT: 4,
    WIN_NUMS: 5,
    WIN_TEXT: 6,
}

//Enums for all text buttons
const button = {
    BET_1: 0,
    BET_2: 1,
    BET_3: 2,
    LUCKY: 3,
    PLAY: 4,
    RESET: 5,
    TRY_AGAIN: 6,
    DEBUG_MATCH_3: 7,
    DEBUG_MATCH_4: 8,
    DEBUG_MATCH_5: 9,
    DEBUG_MATCH_6: 10,
}

var canvas = document.getElementById("lottery");
var ctx = canvas.getContext("2d");

var debug = false;               //Add debug buttons to test the game

var playerMoney = 50;           //The players money, and starting money
var betAmounts = [1, 5, 10];    //The amounts the player can bet
var numOfBalls = 59;            //Number of lottery balls
var winningsAmount = [0, 0, 0, 50, 100, 200, 500];  //The amount the player can win depending on number of matches
var maxBalls = 6;               //The max number of lottery balls to choose

var playerNumbers = [];         //The players chosen lottery numbers
var currentBet;                 //The bet for the current play
var winningNumbers = [];        //The winning numbers for the current play
var texts = [];                 //Array of all texts (Text class)
var textButtons = [];           //Array of all buttons (TextButton class)
var lotteryBalls = [];          //Array for the lottery ball objects (Ball class)
var numOfMatches = 0;           //Number of matches between the player numbers and winning numbers
var currentState = state.PAY;   //The current state of the game loop, starting with the betting screen
var allNumbers = [];            //Array of numbers 1 to numOfBalls
var showBallTime = 0;           //Time since the last winning ball was shown
var showBallWaitTime = 1000;    //Time to wait till the next winning ball is shown
var showBall = 0;               //Which winning ball is to be shown next (base 0)
var shownBalls = [];            //All currently shown balls
var lastUpdate = Date.now();    //Time since last update() For calculating deltaTime

//Text class, for creating an object used to draw text to the canvas
class Text {
    //Default Values
    x = 0;
    y = 0;
    text = "TEST TEXT";
    draw = true;
    color = "white"; 
    font = "Arial";
    fontSize = 40;
    align = "left";

    //Constructor, checking if the passed parameters include any nulls/missing parameters
    constructor(params) {
        if (params.x != null)           this.x = params.x;
        if (params.y != null)           this.y = params.y;
        if (params.text != null)        this.text = params.text;
        if (params.draw != null)        this.draw = params.draw;
        if (params.color != null)       this.color = params.color;
        if (params.font != null)        this.font = params.font;
        if (params.fontSize != null)    this.fontSize = params.fontSize;
        if (params.align != null)       this.align = params.align;
    }
}

//TextButton class, for creating a button with text to the canvas
class TextButton extends Text {
    //Default Values
    width = 150;
    height = 50;
    fillStyle = "white";
    strokeStyle = "black";

    //Constructor, calling original Text constructor, then checking TextButton params
    constructor(params) {
        super(params);

        if (params.width != null) this.width = params.width;
        if (params.height != null) this.height = params.height;
        if (params.fillStyle != null) this.fillStyle = params.fillStyle;
        if (params.strokeStyle != null) this.strokeStyle = params.strokeStyle;

        //Replace original Text classes defaults
        if (params.text == null) this.text = "TEST BUTTON";
        if (params.color == null) this.color = "black";
        if (params.fontSize == null) this.fontSize = 20;
        if (params.align == null) this.align = "center";
    }
}

//Ball class, for drawing the 59 lottery balls to the canvas
class Ball {
    //Default Values
    x = 0;
    y = 0;
    radius = 20;
    number = 0;
    draw = true;
    textColor = "white";
    ballColor = "red";
    font = "Arial";
    fontSize = 20;
    align = "center";

    //Constructor, checking if the passed parameters include any nulls/missing parameters
    constructor(params) {
        if (params.x != null) this.x = params.x;
        if (params.y != null) this.y = params.y;
        if (params.radius != null) this.radius = params.radius;
        if (params.number != null) this.number = params.number;
        if (params.draw != null) this.draw = params.draw;
        if (params.textColor != null) this.textColor = params.textColor;
        if (params.ballColor != null) this.ballColor = params.ballColor;
        if (params.font != null) this.font = params.font;
        if (params.fontSize != null) this.fontSize = params.fontSize;
        if (params.align != null) this.align = params.align;
    }
}

//Draw the game screen (lottery balls)
function drawGame() {
    for (let i = 0; i < lotteryBalls.length; i++) {
        //Draw the ball shape
        ctx.beginPath();
        ctx.fillStyle = lotteryBalls[i].ballColor;
        ctx.arc(lotteryBalls[i].x, lotteryBalls[i].y, lotteryBalls[i].radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        //Draw the ball number
        ctx.font = lotteryBalls[i].fontSize + "px " + lotteryBalls[i].font;
        ctx.fillStyle = lotteryBalls[i].textColor;
        ctx.textAlign = lotteryBalls[i].align;
        ctx.fillText(lotteryBalls[i].number, lotteryBalls[i].x, lotteryBalls[i].y);
    }
}

//Draw all texts
function drawTexts() {
    //Draw all texts, checking if .draw is true
    for (let i = 0; i < texts.length; i++) {
        if (texts[i].draw) {
            //Set the ctx text parameters
            ctx.font = texts[i].fontSize + "px " + texts[i].font;
            ctx.fillStyle = texts[i].color;
            ctx.textAlign = texts[i].align;

            //Split the text to another line if <br> is included
            splitText = texts[i].text.split(" ");
            finalText = [""];
            numLines = 0;
            for (let j = 0; j < splitText.length; j++) {
                //If the next word is a <br>, start a second line for the next word
                if (splitText[j] == "<br>") {
                    numLines++;
                    finalText.push("");
                    continue;
                }

                finalText[numLines] += splitText[j];

                //Add a space for the next character
                if (j < splitText.length - 1)
                    finalText[numLines] += " ";
            }
            //Draw each line of the text
            for (let j = 0; j < numLines + 1; j++) {
                finalText[j] = finalText[j].trim();
                ctx.fillText(finalText[j], texts[i].x, texts[i].y - (texts[i].fontSize * (numLines - j)));
            }
        }
    }
}

//Draw all interactable buttons
function drawButtons() {
    for (let i = 0; i < textButtons.length; i++) {
        if (textButtons[i].draw) {
            //Draw the button
            ctx.strokeStyle = textButtons[i].strokeStyle;
            ctx.fillStyle = textButtons[i].fillStyle;
            ctx.fillRect(textButtons[i].x - (textButtons[i].width / 2), textButtons[i].y - (textButtons[i].height / 2), textButtons[i].width, textButtons[i].height);
            ctx.strokeRect(textButtons[i].x - (textButtons[i].width / 2), textButtons[i].y - (textButtons[i].height / 2), textButtons[i].width, textButtons[i].height);

            //Draw the text for the button
            ctx.fillStyle = textButtons[i].color;
            ctx.textAlign = textButtons[i].align;
            ctx.font = textButtons[i].fontSize + "px " + textButtons[i].font;
            ctx.fillText(textButtons[i].text, textButtons[i].x, textButtons[i].y + textButtons[i].fontSize / 3);
        }
    }
}

//Reset all necessary values in order to play the game again
function reset() {
    removeBall(0);
    playerNumbers.length = 0;
    texts[text.PLAYER_BET].text = "Your bet: --";

    while (winningNumbers.length > 0) {
        lotteryBalls[winningNumbers[0]-1].ballColor = "red";
        winningNumbers.shift();
    }
    winningNumbers.length = 0;
    showBall = 0;
    showBallTime = 0;
    shownBalls.length = 0;
    numOfMatches = 0;
}

//Clear and redraw the canvas screen
function render() {
	//Clear the canvas each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawGame();

    //Draw a black background for the pay state only
    if (currentState == state.PAY) {
        ctx.fillStyle = "black";
        ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
    }

    drawTexts();
    drawButtons();
}

//Update using deltaTime, only needed while showing the winning balls to add a delay
function update(deltaTime) {
    if (currentState == state.ROLLING) {
        showBallTime += deltaTime;
        if (showBallTime > showBallWaitTime) {
            showBallTime -= showBallWaitTime;
            if (showBall < maxBalls) {
                showWinningNumber(showBall++);
            }
            else {
                changeState(state.END);
            }
        }
    }
}

//Game loop which calls itself continuously
function run() {
    var deltaTime = Date.now() - lastUpdate;
    lastUpdate = Date.now();

	update(deltaTime);
	render();
	window.requestAnimationFrame(run);
}

//Add a ball to the list of player choices from allNumbers. Passing 0 will add a random number
function addBall(ballNumber) {
    //If there are already the max number of chosen numbers, do not add any more
    if (playerNumbers.length >= maxBalls) {
        return false;
    }
    //Add a random number
    if (ballNumber == 0) {
        ballNumber = allNumbers.splice(Math.floor(Math.random() * allNumbers.length), 1);
    }
    //If the chosen number is already selected, return false
    for (let i = 0; i < playerNumbers.length; i++) {
        if (playerNumbers[i] == ballNumber) {
            return false;
        }
    }
    //Search through allNumbers and splice the chosen ball number
    for (let i = 0; i < allNumbers.length; i++) {
        if (allNumbers[i] == ballNumber) {
            allNumbers.splice(i, 1);
            break;
        }
    }
    playerNumbers.push(ballNumber);
    playerNumbers.sort(function (a, b) { return a - b });

    texts[text.PLAYER_NUMS].text = "Your Numbers: ";
    for (let i = 0; i < playerNumbers.length; i++) {
        texts[text.PLAYER_NUMS].text = texts[text.PLAYER_NUMS].text + " " + playerNumbers[i] + "  ";
    }

    //Set the chosen lottery ball to green
    lotteryBalls[ballNumber - 1].ballColor = "green";

    //If we have reached the max number of balls, dehighlight Lucky Dip and highlight Play!
    if (playerNumbers.length == maxBalls) {
        textButtons[button.LUCKY].fillStyle = "red";
        textButtons[button.PLAY].fillStyle = "green";
    }

    return true;
}

//Remove a ball from the list of player choices, adding it back to allNumbers. Passing 0 will remove all chosen numbers
function removeBall(ballNumber) {
    //Remove all chosen numbers
    if (ballNumber == 0) {
        while (playerNumbers.length > 0) {
            x = playerNumbers.splice(0, 1);
            lotteryBalls[x-1].ballColor = "red";
            allNumbers.push(x);
        }

        texts[text.PLAYER_NUMS].text = "Your Numbers: ";
        textButtons[button.LUCKY].fillStyle = "yellow";
        textButtons[button.PLAY].fillStyle = "red";

        return true;
    }
    //Remove the specific chosen number
    for (let i = 0; i < playerNumbers.length; i++) {
        if (playerNumbers[i] == ballNumber) {
            playerNumbers.splice(i, 1);

            texts[text.PLAYER_NUMS].text = "Your Numbers: ";
            for (let i = 0; i < playerNumbers.length; i++) {
                if (playerNumbers[i] != null) {
                    texts[text.PLAYER_NUMS].text = texts[text.PLAYER_NUMS].text + " " + playerNumbers[i] + "  ";
                }
            }

            allNumbers.push(ballNumber);
            textButtons[button.LUCKY].fillStyle = "yellow";
            textButtons[button.PLAY].fillStyle = "red";

            return true;
        }
    }

    //Return false if the chosen number is not in the player list
    return false;
}

//Roll the chosen number of winning lottery balls
function rollLottery(balls) {
    while (balls > 0) {
        y = Math.floor(Math.random() * numOfBalls) + 1;
        for (let i = 0; i < winningNumbers.length; i++) {
            if (winningNumbers[i] == y) {
                rollLottery(balls);
                return;
            }
        }
        winningNumbers.push(y);
        balls--;
    }
}

//Show a single winning number, passing the winning ball number to show from winningNumbers (base 0)
function showWinningNumber(ball) {
    shownBalls.push(winningNumbers[ball]);
    shownBalls.sort(function (a, b) { return a - b });
    texts[text.WIN_NUMS].text = "And the winning numbers are... <br> <br> ";
    for (let i = 0; i < shownBalls.length; i++) {
        texts[text.WIN_NUMS].text = texts[text.WIN_NUMS].text + shownBalls[i] + "   ";
    }

    //Check for winning numbers
    if (lotteryBalls[winningNumbers[ball] - 1].ballColor == "green") {
        lotteryBalls[winningNumbers[ball] - 1].ballColor = "gold";
        numOfMatches++;
    }
    else {
        lotteryBalls[winningNumbers[ball] - 1].ballColor = "blue";
    }
}

//Return if a TextButton has been pressed
function clickedText(button, x, y) {
    if (x > button.x - (button.width / 2) && x < button.x + (button.width / 2)) {
        if (y > button.y - (button.height / 2) && y < button.y + (button.height / 2)) {
            return true;
        }
    }
    return false;
}

//Return if a lottery ball has been pressed, using the addBall and removeBall functions when applicable
function clickedBall(ballNumber, x, y) {
    if (x > lotteryBalls[ballNumber].x - lotteryBalls[ballNumber].radius && x < lotteryBalls[ballNumber].x + lotteryBalls[ballNumber].radius) {
        if (y > lotteryBalls[ballNumber].y - lotteryBalls[ballNumber].radius && y < lotteryBalls[ballNumber].y + lotteryBalls[ballNumber].radius) {
            if (!addBall(ballNumber + 1)) {
                removeBall(ballNumber + 1);
                lotteryBalls[ballNumber].ballColor = "red";
            }
            return true;
        }
    }
    return false;
}

//Change to the passed state, or if called without any params, change to the next state up
function changeState(newState) {
    if (newState == null) {
        currentState++;
        if (currentState > state.END) {
            currentState == state.PAY;
        }
    }
    else {
        currentState = newState;
    }
    switch (currentState) {
        case state.PAY:
            reset();
            texts[text.CHOOSE_TEXT].draw = true;
            texts[text.WIN_NUMS].draw = false;
            texts[text.WIN_TEXT].draw = false;
            for (let i = 0; i < 3; i++) {
                if (playerMoney >= betAmounts[i]) {
                    textButtons[i].draw = true;
                }
            }
            textButtons[button.TRY_AGAIN].draw = false;
            break;
        case state.SELECTION:
            playerMoney -= currentBet;
            texts[text.PLAYER_MONEY].text = "Your money: " + playerMoney;
            texts[text.PLAYER_BET].text = "Your bet: " + currentBet;

            texts[text.CHOOSE_TEXT].draw = false;
            texts[text.PICK_TEXT].draw = true;
            for (let i = 0; i < 3; i++) {
                textButtons[i].draw = false;
            }
            for (let i = 3; i < 6; i++) {
                textButtons[i].draw = true;
            }
            if (debug) {
                for (let i = 7; i < 11; i++) {
                    textButtons[i].draw = true;
                }
            }
            break;
        case state.ROLLING:
            for (let i = 3; i < 6; i++) {
                textButtons[i].draw = false;
            }
            if (debug) {
                for (let i = 7; i < 11; i++) {
                    textButtons[i].draw = false;
                }
            }
            texts[text.PICK_TEXT].draw = false;
            texts[text.WIN_NUMS].draw = true;
            texts[text.WIN_NUMS].text = "And the winning numbers are... <br> <br> ";
            break;
        case state.END:
            texts[text.WIN_TEXT].draw = true;
            if (numOfMatches <= 2) {
                texts[text.WIN_TEXT].text = "You matched " + numOfMatches + " ball";
                if (numOfMatches != 1) {
                    texts[text.WIN_TEXT].text = texts[text.WIN_TEXT].text + "s";
                }
                texts[text.WIN_TEXT].text = texts[text.WIN_TEXT].text + " unfortunately. <br> Select Play again to try again!";
            }
            else {
                texts[text.WIN_TEXT].text = "You matched " + numOfMatches + " balls! <br> You win " + (currentBet * winningsAmount[numOfMatches]) + "! <br> Congratulations!";
                playerMoney += currentBet * winningsAmount[numOfMatches];
                texts[text.PLAYER_MONEY].text = "Your money: " + playerMoney;
            }
            if (playerMoney <= 0) {
                texts[text.WIN_TEXT].text = texts[text.WIN_TEXT].text + " <br> You have ran out of money. <br> Please refresh the browser to play again!";
            }
            else {
                textButtons[button.TRY_AGAIN].draw = true;
            }
            break;
        default:
        //Shouldn't reach this state
    }
}

//Get when the player clicks the canvas, and check if a button or lotteryBall is pressed
function getMouseClick(event) {
    //Get mouse coords relative to canvas
    mouseX = event.pageX - canvas.offsetLeft;
    mouseY = event.pageY - canvas.offsetTop;
    //Check if a button has been pressed
    for (let i = 0; i < textButtons.length; i++) {
        if (textButtons[i].draw) {
            if (clickedText(textButtons[i], mouseX, mouseY)) {
                switch (i) {
                    case button.BET_1:
                    case button.BET_2:
                    case button.BET_3:
                        currentBet = betAmounts[i];
                        changeState(state.SELECTION);
                        return;
                    case button.LUCKY:
                        while (addBall(0));
                        return;
                    case button.PLAY:
                        if (textButtons[button.PLAY].fillStyle == "green") {
                            rollLottery(maxBalls);
                            changeState(state.ROLLING);
                        }
                        return;
                    case button.RESET:
                        removeBall(0);
                        return;
                    case button.TRY_AGAIN:
                        changeState(state.PAY);
                        reset();
                        return;
                    //Debug button cases, match the chosen number of numbers, then auto fill the rest
                    case button.DEBUG_MATCH_3:
                        removeBall(0);
                        rollLottery(maxBalls);
                        for (let i = 0; i < 3; i++) {
                            addBall(winningNumbers[i]);
                        }
                        while (addBall(0));
                        changeState(state.ROLLING);
                        return;
                    case button.DEBUG_MATCH_4:
                        removeBall(0);
                        rollLottery(maxBalls);
                        for (let i = 0; i < 4; i++) {
                            addBall(winningNumbers[i]);
                        }
                        while (addBall(0));
                        changeState(state.ROLLING);
                        return;
                    case button.DEBUG_MATCH_5:
                        removeBall(0);
                        rollLottery(maxBalls);
                        for (let i = 0; i < 5; i++) {
                            addBall(winningNumbers[i]);
                        }
                        while (addBall(0));
                        changeState(state.ROLLING);
                        return;
                    case button.DEBUG_MATCH_6:
                        removeBall(0);
                        rollLottery(maxBalls);
                        for (let i = 0; i < 6; i++) {
                            addBall(winningNumbers[i]);
                        }
                        while (addBall(0));
                        changeState(state.ROLLING);
                        return;
                    default:
                        break;
                }
            }
        }
    }
    //Check if a lotteryb ball has been pressed
    if (currentState == state.SELECTION) {
        for (let i = 0; i < lotteryBalls.length; i++) {
            if (clickedBall(i, mouseX, mouseY)) {
                return;
            }
        }
    }
}

//When the game is first loaded, prepare all necessary objects and variables
window.onload = () => {
    //Create an array of all lottery balls (allNumbers) and an array of the Ball class lottery balls (lotteryBalls)
    //This is drawn to the canvas using the x and y below
    x = 0;
    y = 0;
    for (let i = 1; i <= numOfBalls; i++) {
        allNumbers.push(i);
        lotteryBalls.push(new Ball({ x: (canvas.width / 10) + (canvas.width/20 * x), y: canvas.height / 3 + (canvas.height / 15 * y), number: i }));
        x++;
        if (x > 16) {
            x = 0;
            y++;
        }
    }
    
    //Create all text UI objects
    texts.push(new Text({ x: canvas.width / 2, y: canvas.height/2 - 150, text: "Choose your bet amount", align: "center" }));
    texts.push(new Text({ x: 50, y: 50, text: "Your money: " + playerMoney }));
    texts.push(new Text({ x: canvas.width-50, y: 50, text: "Your bet: --", align: "right" }));
    texts.push(new Text({ x: 50, y: canvas.height - 50, text: "Your Numbers: " }));
    texts.push(new Text({ x: canvas.width / 2, y: canvas.height / 4, text: "Pick your 6 lottery numbers, or select <br> the Lucky Dip button to auto select!", align: "center", draw: false }));
    texts.push(new Text({ x: canvas.width / 2, y: canvas.height / 4, text: "WINNING NUMBERS", align: "center", draw: false }));
    texts.push(new Text({ x: canvas.width / 6, y: canvas.height - 200, text: "WINNING TEXT", fontSize: 30, draw: false }));

    //Create all text button objects
    textButtons.push(new TextButton({ x: canvas.width / 2 - 200, y: canvas.height / 2, text: betAmounts[0], draw: false }));
    textButtons.push(new TextButton({ x: canvas.width / 2, y: canvas.height / 2, text: betAmounts[1], draw: false }));
    textButtons.push(new TextButton({ x: canvas.width / 2 + 200, y: canvas.height / 2, text: betAmounts[2], draw: false }));
    textButtons.push(new TextButton({ x: canvas.width / 2 + 100, y: canvas.height / 7 * 5, width: 200, height: 200, text: "Lucky Dip", fontSize: 40, fillStyle: "yellow", draw: false }));
    textButtons.push(new TextButton({ x: canvas.width / 2 + 320, y: canvas.height / 7 * 5, width: 200, height: 200, text: "Play!", fontSize: 40, fillStyle: "red", draw: false }));
    textButtons.push(new TextButton({ x: canvas.width / 2 - 120, y: canvas.height / 7 * 5, width: 200, height: 120, text: "Reset", fontSize: 40, draw: false }));
    textButtons.push(new TextButton({ x: canvas.width / 2 + 320, y: canvas.height / 7 * 5, width: 200, height: 120, text: "Play again", fontSize: 40, draw: false }));
    //Create debug text button objects
    textButtons.push(new TextButton({ x: 75, y: 525, width: 100, height: 50, text: "Match 3+", fontSize: 20, draw: false }));
    textButtons.push(new TextButton({ x: 75, y: 575, width: 100, height: 50, text: "Match 4+", fontSize: 20, draw: false }));
    textButtons.push(new TextButton({ x: 175, y: 525, width: 100, height: 50, text: "Match 5+", fontSize: 20, draw: false }));
    textButtons.push(new TextButton({ x: 175, y: 575, width: 100, height: 50, text: "Match 6", fontSize: 20, draw: false }));

    if (!debug) document.getElementById("inst_debug").style.display = "none";

    //Event listener for when the user clicks the screen
    canvas.addEventListener("mousedown", getMouseClick);

    changeState(state.PAY);
    window.requestAnimationFrame(run);
}
