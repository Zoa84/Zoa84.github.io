var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");
var keysDown = {};
var lives = 3;
var score = 0;
var gameover = true;
//array of brick objects
var bricks = [];
//used to get the area where the ball hits the paddle
var paddle_reflect = 0;
var level = 0;
//how many bricks are remaining
var bricks_left = 0;
var time = 0;
//% speed of the ball
var speed = 1;
//amount of freeze power left
var freeze = 5;
var place1 = 0;
var place2 = 0;
//hp to set during brick creation
var hp;

var ball = {
	x: canvas.width / 2,			//pixels
	y: canvas.height / 5 * 4 - 20,	//pixels
	xSpeed: 2.5,					//speed per frame
	ySpeed: -2.5,					//speed per frame
	radius: 10						//pixels
}

var paddle = {
	x: canvas.width / 2,			//pixels
	y: canvas.height / 5 * 4,		//pixels
	xSpeed: 5,						//speed per frame
	width: 150,
	height: 10
}

var brick = function(x, y, xSize, ySize, hp) {
	this.x = x;
	this.y = y;
	this.xSize = xSize;
	this.ySize = ySize;
	this.hp = hp;
	this.ren = true;				//whether the brick should be rendered
}

//Create multiple brick variables under a bricks array depending on level
function create_bricks() {
	if(level==0) {
		for(i = 0; i < 32; i++) {
			if(i < 8) {
				place1 = 0;
				place2 = i;
				hp = 4;
			}
			else if(i < 16) {
				place1 = 1;
				place2 = i-8;
				hp = 3;
			}
			else if(i < 24) {
				place1 = 2;
				place2 = i-16;
				hp = 2;
			}
			else if(i < 32) {
				place1 = 3;
				place2 = i-24;
				hp = 1;
			}
			bricks[bricks.length] = new brick(place2*100+25, 50+(25*place1), 50, 5, hp);
			bricks_left += 1;
		}
	}
	else if(level==1) {
		for(i = 0; i < 6; i++) {
			bricks[bricks.length] = new brick(i*100+125, 50, 50, 5, 4);
			bricks_left += 1;
		}
		for(i = 0; i < 16; i++) {
			bricks[bricks.length] = new brick(i*50+25, 100, 5, 50, 3);
			bricks_left += 1;
		}
		for(i = 0; i < 8; i++) {
			bricks[bricks.length] = new brick(i*100+25, 200, 50, 5, 2);
			bricks_left += 1;
		}
	}
	else if(level==2) {
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(375, 25, 50, 5, 4);
			bricks_left += 1;
		}
		for(i = 0; i < 2; i++) {
			bricks[bricks.length] = new brick(i*100+325, 50, 50, 5, 4);
			bricks_left += 1;
		}
		for(i = 0; i < 3; i++) {
			bricks[bricks.length] = new brick(i*100+275, 75, 50, 5, 3);
			bricks_left += 1;
		}
		for(i = 0; i < 4; i++) {
			bricks[bricks.length] = new brick(i*100+225, 100, 50, 5, 3);
			bricks_left += 1;
		}
		for(i = 0; i < 5; i++) {
			bricks[bricks.length] = new brick(i*100+175, 125, 50, 5, 2);
			bricks_left += 1;
		}
		for(i = 0; i < 6; i++) {
			bricks[bricks.length] = new brick(i*100+125, 150, 50, 5, 2);
			bricks_left += 1;
		}
		for(i = 0; i < 7; i++) {
			bricks[bricks.length] = new brick(i*100+75, 175, 50, 5, 1);
			bricks_left += 1;
		}
		for(i = 0; i < 8; i++) {
			bricks[bricks.length] = new brick(i*100+25, 200, 50, 5, 1);
			bricks_left += 1;
		}
	}
	else if(level==3) {
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(75, 50, 100, 5, 4);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(75, 50, 5, 200, 2);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(175, 50, 5, 200, 2);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(75, 150, 105, 5, 3);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(225, 50, 100, 5, 4);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(275, 50, 5, 200, 2);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(350, 50, 100, 5, 4);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(350, 50, 5, 200, 3);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(450, 50, 5, 200, 3);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(350, 150, 105, 5, 2);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(500, 50, 100, 5, 4);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(500, 50, 5, 200, 3);
			bricks_left += 1;
		}
		for(i = 0; i < 1; i++) {
			bricks[bricks.length] = new brick(675, 50, 5, 200, 1);
			bricks_left += 1;
		}
	}
}

//Create the bricks variable for the first time. Not used after initial setup
create_bricks();

function render() {
	//clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	//draw bricks
	for(i = 0; i < bricks.length; i++) {
		if(bricks[i].ren == true) {
			ctx.rect(bricks[i].x, bricks[i].y, bricks[i].xSize, bricks[i].ySize);
			//depending on the bricks health, change the colour of them
			if(bricks[i].hp == 4) {
				ctx.fillStyle="blue";
			}
			else if(bricks[i].hp == 3) {
				ctx.fillStyle="green";
			}
			else if(bricks[i].hp == 2) {
				ctx.fillStyle="yellow";
			}
			else if(bricks[i].hp == 1) {
				ctx.fillStyle="red";
			}
			ctx.fillRect(bricks[i].x, bricks[i].y, bricks[i].xSize, bricks[i].ySize);
		}
	}
	// draw the ball
	//beginPath and closePath stops the white colour being applied to the bricks
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	//draw paddle
	ctx.rect(paddle.x-(paddle.width/2), paddle.y, paddle.width, paddle.height);
	//draw text
	ctx.font = "20px Times New Roman";
	ctx.textAlign = "left";
	ctx.fillText("Lives: " + lives + " Time: " + parseInt(time) + " Score: " + score, 30, 30);
	//draw freeze power
	ctx.textAlign = "right";
	ctx.fillText("Freeze:", canvas.width-230, 30);
	ctx.rect(canvas.width-220, 13, (freeze*40), 20);
	ctx.closePath();
	//draw Game Over if gameover is true. gameover is also used when the game is stopped
	if(gameover == true) {
		ctx.textAlign = "center";
		ctx.font = "50px Times New Roman";
		if(lives == 0) {
			ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
			ctx.fillText("Press Enter to restart", canvas.width/2, canvas.height/3*2);
		}
		else {
			ctx.fillText("Press Space to shoot ball", canvas.width/2, canvas.height/2);
		}
	}
	ctx.fill();
}

function update() {	
	//set window key press listeners
	window.addEventListener("keydown",function(e){
		keysDown[e.keyCode] = true;
	});
	window.addEventListener("keyup",function(e){
		delete keysDown[e.keyCode];
	});
	
	//restart game with Enter key
	if(13 in keysDown) {
		lives = 3;
		score = 0;
		time = 0;
		level = 0;
		freeze = 5;
		gameover = true;
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 5 * 4 - 20;
		ball.xSpeed = 2.5;
		ball.ySpeed = -2.5;
		paddle.x = canvas.width / 2;
		paddle.y = canvas.height / 5 * 4;
		//reset bricks
		bricks = [];
		bricks_left = 0;
		create_bricks();
	}
	
	speed = 1;
	
	//start game with space key
	if(32 in keysDown) {
		if(gameover == true && lives != 0) {
			gameover = false;
			ball.xSpeed = 2.5;
			ball.ySpeed = -2.5;
		}
		else if(gameover == false) {
			if(freeze >= 0.1) {
				freeze -=0.1;
				speed = 0.5;
			}
		}
	}
	else if(freeze <= 5){
		freeze += 0.01;
	}
	
	//move paddle left and right with arrow keys
	if(37 in keysDown) {
		paddle.x -= (paddle.xSpeed);
		if(paddle.x <= paddle.width/2) {
			paddle.x = paddle.width/2;
		}
	}
	if(39 in keysDown) {
		paddle.x += (paddle.xSpeed);
		if(paddle.x+(paddle.width/2) >= canvas.width) {
			paddle.x = canvas.width-(paddle.width/2);
		}
	}
	
	//allows changing of the starting level as long as the game hasn't started
	if(gameover == true && lives == 3) {
		//change level
		if(49 in keysDown || 50 in keysDown || 51 in keysDown || 52 in keysDown) {
			if(49 in keysDown) {
				level = 0;
			}
			if(50 in keysDown) {
				level = 1;
			}
			if(51 in keysDown) {
				level = 2;
			}
			if(52 in keysDown) {
				level = 3;
			}
			bricks = [];
			bricks_left = 0;
			create_bricks();
		}
	}
	
	//allows the player to set the start position of the paddle and ball inbetween games
	if(gameover == true || lives == 0) {
		ball.x = paddle.x;
	}
	else if(lives != 0) {
		time += (1/60);
		
		//update the ball position
		ball.y += ball.ySpeed*speed;
		ball.x += ball.xSpeed*speed;
	  
		//all bricks destroyed
		if(bricks_left==0) {
			ball.x = canvas.width / 2;
			ball.y = canvas.height / 5 * 4 - 20;
			ball.xSpeed = 2.5;
			ball.ySpeed = -2.5;
			paddle.x = canvas.width / 2;
			paddle.y = canvas.height / 5 * 4;
			gameover = true;
			freeze = 5;
			if(level<3) {
				level += 1;
			}
			else {
				level = 0; 
			}
			//reset bricks
			bricks = [];
			create_bricks();
		}

		//bounce the ball off all edges
		if(ball.x <= ball.radius || ball.x >= canvas.width-ball.radius) {
			ball.xSpeed *= -1;
		}
		if(ball.y <= ball.radius) {
			ball.ySpeed *= -1;
			ball.y = ball.radius;
		}
		//Put ball right next to wall
		if(ball.x <= ball.radius) {
			ball.x = ball.radius;
		}
		if(ball.x >= canvas.width-ball.radius) {
			ball.x = canvas.width-ball.radius;
		}
	  
		//bounce the ball off bricks
		for(i = bricks.length-1; i > -1; i--) {
			if(bricks[i].ren == true) {
				if(ball.x+ball.radius+(ball.xSpeed*speed) >= bricks[i].x && ball.x-ball.radius+(ball.xSpeed*speed) <= bricks[i].x+bricks[i].xSize) {
					if(ball.y+ball.radius+(ball.ySpeed*speed) >= bricks[i].y && ball.y-ball.radius+(ball.ySpeed*speed) <= bricks[i].y+bricks[i].ySize) {
						if(ball.y+ball.radius >= bricks[i].y && ball.y-ball.radius <= bricks[i].y+bricks[i].ySize) {
							ball.xSpeed *= -1;
							if(ball.x+ball.radius+(ball.xSpeed*speed) >= bricks[i].x) {
								ball.x = bricks[i].x+bricks[i].xSize+ball.radius;
							}
							else
							{
								ball.x = bricks[i].x-ball.radius;
							}
						}
						else
						{
							ball.ySpeed *= -1;
							if(ball.y+ball.radius+(ball.ySpeed*speed) >= bricks[i].y) {
								ball.y = bricks[i].y+bricks[i].ySize+ball.radius;
							}
							else
							{
								ball.y = bricks[i].y-ball.radius;
							}
						}
						bricks[i].hp -= 1;
						score += 1;
						//brick destroyed
						if(bricks[i].hp == 0) {
							bricks[i].ren = false;
							bricks_left -= 1;
						}
					}
				}
			}
		}
	  
		//ball falls down
		if(ball.y >= canvas.height-ball.radius) {
			ball.y = canvas.height / 5 * 4 - 20;
			lives -= 1;
			ball.x = paddle.x;
			gameover = true;
			freeze = 5;
			//Game over if lives == 0
			if(lives == 0) {
				ball.x = canvas.width / 2;
				ball.xSpeed = 0;
				ball.ySpeed = 0;
			}
		}
	  
		//bounce the ball off paddle
		if(ball.x+ball.radius <= paddle.x+(paddle.width/2) && ball.x-ball.radius >= (paddle.x-paddle.width/2)) {
			if(ball.y-ball.radius <= paddle.y+paddle.height && ball.y+ball.radius >= paddle.y) {
				ball.y = paddle.y-ball.radius;
				//Get a number between 0 and 1 which represents which part of the paddle has been hit
				//then work out a xSpeed and ySpeed based on it
				paddle_reflect = (ball.x-(paddle.x-(paddle.width/2))) / ((paddle.x+(paddle.width/2))-(paddle.x-(paddle.width/2)));
				if(paddle_reflect <= 0.5)
				{
					ball.ySpeed = - ((paddle_reflect*2) * 5);
					ball.xSpeed = - (5 + ball.ySpeed);
				}
				else
				{
					ball.xSpeed = ((paddle_reflect-0.5)*2) * 5;
					ball.ySpeed = -(5 - ball.xSpeed);
				}
			}
		}
	}
}

function run(timestamp) {
	update();                             			 //update the game
	render();                                   	 //render the scene
	window.requestAnimationFrame(run);          	 //ask browser to call this function again, when it's ready
}

//trigger the game loop
window.requestAnimationFrame(run);
