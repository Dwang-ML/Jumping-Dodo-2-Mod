function getRandColor(brightness){
    //6 levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
    return "rgb(" + mixedrgb.join(",") + ")";
  }
function getRandomDarkColor() {
    var letters = 'abcde'.split('');
    var color = '#';        
    color += letters[Math.floor(Math.random() * letters.length)];
    
    //letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 5; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}  

var highscoreMode = false;

function respawnclick() {
  document.getElementById('button4').style.top = "-170px";

  clearInterval(fallInterval);
  clearInterval(backgroundInterval);
  clearInterval(firstinterval);
  clearInterval(myGameArea.interval);
  document.getElementById('spacebar').style.opacity = 1.0;

  buttonPressed = false;
  buttonAlpha = 1.0;
  canvasAlpha = 0.0;
  popNo = 0;
  fromTop = 250;
  helpAlpha = 1.0;
  firstKeyDown = false;
  respawnY = -170;
  score = 0;
  velocityX = 1.8;
  velocityY = 0;
  spacebarDown = false;
  alive = true;
  frequency = 1800;
  fallList = [];
  upList = [];
  sideList = [];
  xList = [];
  coolThingsUp = [];
  backgroundList = [];
  speedupList = [];
  invincibleList = [];
  trails = [];
  playerFloat = 0.0;
  backgroundY = 50;
  number = 0;
  did = false;
  myGameArea.clear();
  aButtonIsPressed();
  randomChange = 6;
  speedup = 10;
  invincible = 0;
}

var firstGame = true;
var level = "idk";
var buttonPressed = false;
var buttonAlpha = 1.0;
var canvasAlpha = 0.0;
var popNo = 0;
var fromTop = 250;
var helpAlpha = 1.0;
var firstKeyDown = false;
var acceptClicks = true;
var respawnY = -170;

var score = 0;
var velocityX = 1.8;
var velocityY = 0;
var spacebarDown = false;
var alive = true;
var frequency = 1300;
var fallList = [];
var upList = [];
var sideList = [];
var xList = [];
var coolThingsUp = [];
var backgroundList = [];
var speedupList = [];
var invincibleList = [];
var trails = [];
var playerFloat = 0.0;
var backgroundY = 50;
var rotation = 0.0;
var randomChange = 6;
var speedup = 10;
var invincible = 0;


var player;
var fallInterval;
var backgroundInterval;
var image2;


function buttonclick5() {
    aButtonIsPressed();
    randomChange = 6;
    level = "difficulty: hard"
    highscoreMode = true;
}

function aButtonIsPressed() {
  if (buttonPressed == false) {
      acceptClicks = true;
      buttonPressed = true;
      document.getElementById('canvas').style.visibility = "visible";
      myGameArea.start();
      player = new component(20, 20, "black", 300, 200);// original green color #68FF2D
  }
}


document.getElementById('button4').onclick = respawnclick;
document.getElementById('button5').onclick = buttonclick5;
document.getElementById('square').onclick = changeskin;
document.getElementById('zombie').onclick = changeskin;
document.getElementById('octapus').onclick = changeskin;

//document.getElementById('img').onclick = infoclick;
document.getElementById('body').onload = bodyLoad;

var skinNo = 0;
let everySkinList = ["octapus", "zombie"];
function changeskin() {
  if (skinNo < (everySkinList.length - 1)) {
    skinNo += 1;
  } else {
    skinNo = 0;
  }
  for (i = 0; i < 7; i += 1) {
    if (i == skinNo) {
      document.getElementById(everySkinList[i]).style.visibility = "visible";
    } else {
      document.getElementById(everySkinList[i]).style.visibility = "hidden";
    }
  }
}

function bodyLoad() {
  document.getElementById("body").style.backgroundColor = "lavender"; //getRandColor(5);
  document.getElementById("highscore").innerHTML = "highscore: " + (localStorage.getItem("dodohighscore"));
}



function drawImage() {
    var c=document.getElementById("canvas");
    var ctx=c.getContext("2d")
    ctx.save();
    ctx.translate(player.x, player.y);
    var ctxRotateCalc = Math.sin(velocityY / velocityX * -0.8)
    if (velocityX > 0) {
      ctxRotateCalc -= 0.35;
    } else {
      ctxRotateCalc += 0.35;
    }
    ctx.rotate(ctxRotateCalc);
    ctx.scale(velocityX * (-10/18), 1);
    var img=document.getElementById(everySkinList[skinNo]);
    ctx.drawImage(img, -10, -10, 58, 20);
    ctx.restore();
}


function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(rotateAngle) {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rotateAngle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x - (this.width / 2);
        var myright = this.x + (this.width / 2);
        var mytop = this.y - (this.height / 2);
        var mybottom = this.y + (this.height / 2); //(this.height);
        var otherleft = otherobj.x - (otherobj.width / 2);
        var otherright = otherobj.x + (otherobj.width / 2);
        var othertop = otherobj.y - (otherobj.height / 2);
        var otherbottom = otherobj.y + (otherobj.height / 2);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

var myGameArea = {
    canvas : document.getElementById("canvas"),
    start : function() {
        canvas.width = 600;
        canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.interval = setInterval(updateGameBoundaries, 10); // update every 10 milliseconds
        backgroundInterval = setInterval(addNewBackgroundColor, 3000);
        fallInterval = setInterval(newFall, 1300);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function addNewBackgroundColor() {
  backgroundList.push(new component(800, 400, getRandomDarkColor(), 400, -200));
}

function newFall() {
	if (firstKeyDown == true) {
	    if (canvasAlpha > 0.9) {
	      let randomX = getRandomInt(100,500);
	      let process1 = Math.round(randomX / 50);
	      let process2 = process1 * 50;

	      fallList.push(new component(20, 20, "black", process2, -20)); // normal

	      if (getRandomInt(1,randomChange) == 1) {
	          let randomXz = getRandomInt(100,500);
	          let process1z = Math.round(randomXz / 50);
	          let process2z = process1z * 50;
	          xList.push(new component(30, 30, "orange", process2z, -20)); // bounce X
	      }

	      if (getRandomInt(0,randomChange) == 1) {
            let randomXa = getRandomInt(100,500);
 	           let process1a = Math.round(randomXa / 50);
	          let process2a = process1a * 50;
	          upList.push(new component(20, 20, "darkblue", process2a, 420)); // from below
	          coolThingsUp.push(new component(20, 20, "darkblue", process2a, 420)); // from below
	      }
	        if (getRandomInt(1,randomChange) == 1) {
	            let randomXb = getRandomInt(100,500);
	            let process1b = Math.round(randomXb / 50);
	            let process2b = process1b * 50;
	            sideList.push(new component(20, 10, "darkblue", process2b, -20)); // moving platform
	        }
	        if (getRandomInt(0,randomChange) == 1) {
	            let randomXk = getRandomInt(100,500);
	            let process1k = Math.round(randomXk / 50);
	            let process2k = process1k * 50;
	            speedupList.push(new component(65, 65, "lavender", process2k, -20)); // swiftness
	        }
	         if (getRandomInt(1,60) == 1) {
	            let randomXz = getRandomInt(100,500);
	            let process1z = Math.round(randomXz / 50);
	            let process2z = process1z * 50;
	            invincibleList.push(new component(40, 40, "lavender", process2z, -20)); // invincible
	        }


	      if (frequency > 900) {
	        frequency -= 50;
	        clearInterval(fallInterval);
	        fallInterval = setInterval(newFall, frequency);
	      }
	    }
	}
}
var did = false;
function updateGameBoundaries() {

	if (alive == true) {
		document.getElementById('highscore').style.visibility = "hidden"
		//document.getElementById('scorelabel').style.visibility = "hidden"
		document.getElementById('scorelabel').style.top = "-10px"
	} else {
		document.getElementById('highscore').style.visibility = "visible"
		document.getElementById('scorelabel').style.visibility = "visible"
		document.getElementById('scorelabel').style.top = "160px"
		document.getElementById('highscore').style.top = "190px"
	}


  rotation += 0.02;
  if ((firstGame == false) && (firstKeyDown == false)) {
    fromTop = 230;
    helpAlpha = 1.0;
    document.getElementById('spacebar').style.top = fromTop;
    document.getElementById('spacebar').style.opacity = helpAlpha;
  }

  if ((alive == false) && (firstKeyDown == true)) {
    firstGame = false;
    if (respawnY < 120) {	
      respawnY += 3;
    }
    if (highscoreMode == true) {
      var currenthighscore = localStorage.getItem("dodohighscore")
      if (score > currenthighscore) {
        localStorage.setItem("dodohighscore", score); // new highscore
        document.getElementById("highscore").innerHTML = "highscore: " + score;
      }
    }

    document.getElementById('button4').style.visibility = "visible";
    document.getElementById('button4').style.opacity = 1;
    document.getElementById('button4').style.top = respawnY + "px";


  }

  if ((alive == true) && (firstKeyDown == false)) {
    document.getElementById('scorelabel').innerHTML = "score: 0";
  }
  if (firstKeyDown == true) {
    if (fromTop < 500) {
      fromTop += 1;
      helpAlpha -= 0.01;
      document.getElementById('spacebar').style.top = fromTop;
      document.getElementById('spacebar').style.opacity = helpAlpha;
    }
  }
  if (firstKeyDown == false) {
    playerFloat += 0.06;
    let math = Math.sin(playerFloat);
    player.y = 200 + (math * 6);
    myGameArea.clear();
    player.update(0);
  }
  if (true) {
    if (buttonAlpha > -0.4) { // black screen duration
      if (firstGame == true) {
        buttonAlpha -= 0.01;
        document.getElementById('body').style.opacity = buttonAlpha;
      } else {
        buttonAlpha = -0.5
      }
    } else {
        if (buttonAlpha <= 0.1) {
          if (did == false) {
            did = true;
            document.getElementById('button4').style.visibility = "hidden";
            document.getElementById('button5').style.visibility = "hidden";
            document.getElementById('octapus').style.visibility = "hidden";
            document.getElementById('zombie').style.visibility = "hidden";
            document.getElementById('square').style.visibility = "hidden";
            document.getElementById('logo').style.visibility = "hidden";
          }
        }
        if (canvasAlpha < 2.0) {
          if (canvasAlpha > 0.1) {
            document.getElementById('spacebar').style.visibility = "visible";
          }

          canvasAlpha += 0.02;
          document.getElementById('body').style.opacity = 1;
          document.getElementById('canvas').style.opacity = canvasAlpha;
          document.getElementById('scorelabel').style.opacity = canvasAlpha;

          document.getElementById('spacebar').style.opacity = (canvasAlpha - 0.8);
        }
    }
  }

  if ((canvasAlpha >= 0.9) || (firstGame == false)) {
    if (alive == true) {
	    if (firstKeyDown == true) {
        score += 1;
        document.getElementById('scorelabel').innerHTML = "score: " + score;
	      if ((player.x < 10) || (player.x > 590)) {
	        velocityX *= -1;
	      }

	      if ((player.y < 10) || (player.y > (390 + velocityY))) {
	        alive = false;
	      }

	      velocityY -= 0.05;

	      player.x += velocityX;
	      player.y -= velocityY;
	      myGameArea.clear(); // WARNING: CLEAR!
      }
      for (i = 0; i < backgroundList.length; i += 1) {
        backgroundList[i].update(0);
      }
      if (firstKeyDown == true) {
        for (i = 0; i < backgroundList.length; i += 1) {
          backgroundList[i].y += 0.8;
          if (backgroundList[i].y > 470) {
            backgroundList[i].y = -20;
          }
        }

        for (i = 0; i < speedupList.length; i += 1) {
        	(speedupList[i]).y += 0.8;
            (speedupList[i]).update(0);
        	if (player.crashWith(speedupList[i])) {
        		speedup = 15;
        	}
		 }
    	if (speedup > 10) {
	        speedup -= 0.1;
		} else {
			speedup = 10;
		}
		if (invincible > 0) {
	        invincible -= 0.01;
		}
		clearInterval(myGameArea.interval);
		myGameArea.interval = setInterval(updateGameBoundaries, speedup);

        for (i = 0; i < xList.length; i += 1) {
          if (((xList[i]).y < 500) && ((xList[i]).y > -200)) {
            if (player.crashWith(xList[i])) {
              velocityX *= -1;
              xList.splice(i, 1);
            }
            (xList[i]).y += 0.8;
            (xList[i]).update(0);
          }
        }
        for (i = 0; i < sideList.length; i += 1) {
          if (((sideList[i]).y < 500) && ((sideList[i]).y > -200)) {
            if (player.crashWith(sideList[i])) {
              if (Math.round(invincible) == 0) {alive = false}
            }
            (sideList[i]).y += 0.8;
            if (player.x > sideList[i].x) {
              (sideList[i]).x += 0.5;
            } else {
              (sideList[i]).x -= 0.5;
            }
            (sideList[i]).update(0);
          }
        }/*
        trails.push(new component(2, 2, "lavender", player.x, player.y)); // normal
		for (i=0;i<trails.length;i+=1) {
			trails[i].y += 0.8;
			trails[i].update();
		}*/

        for (i = 0; i < fallList.length; i += 1) {
          if (((fallList[i]).y < 500) && ((fallList[i]).y > -200)) {
            if (player.crashWith(fallList[i])) {
              if (Math.round(invincible) == 0) {alive = false}
            }
            (fallList[i]).y += 0.8;
            (fallList[i]).update(0);
          }
        }
	      for (i = 0; i < upList.length; i += 1) {
          if (((upList[i]).y < 500) && ((upList[i]).y > -200)) {
  	        if (player.crashWith(upList[i])) {
  	          if (Math.round(invincible) == 0) {alive = false}
  	        }
  	        (upList[i]).y -= 0.3;
  	        (upList[i]).update(rotation);
          }
	      }
        for (i = 0; i < upList.length; i += 1) {
          if (((upList[i]).y < 500) && ((upList[i]).y > -200)) {
            (coolThingsUp[i]).y -= 0.3;
            (coolThingsUp[i]).update(0.8 + rotation);
          }
        }
        for (i = 0; i < invincibleList.length; i += 1) {
        	(invincibleList[i]).y += 0.8;
            (invincibleList[i]).update(0.8);
        	if (player.crashWith(invincibleList[i])) {
        		invincible = 6;
        	}
		 }
	  }
	  if (Math.round(invincible) > 0) {
	  	player.update(0.8);
	  } else {
		  player.update(0);
	 }
    }
  }
  drawImage();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function difficultyUp() {
  if (randomChange > 4) {
    randomChange -= 0.4;
    //document.getElementById('highscore').innerHTML = randomChange;
  }
}
var firstinterval;

document.onkeydown = function(e) {
  if (alive == true) {
  	if (e.keyCode == 32) {
	    if (canvasAlpha >= 0.9) {
        if (firstKeyDown == false) {
  	    	firstKeyDown = true;
          if (highscoreMode == true) {
            firstinterval = setInterval(difficultyUp, 3000);
          }
        }
	      if (spacebarDown == false) {
	        spacebarDown = true;
	        velocityY = 2.4;
	      }
	    }
    }
  }
}

document.onkeyup = function(e) {
	if (e.keyCode == 32) {
	    spacebarDown = false;
	}
}

