var stage, canvas;
var loader;
var w, h;
var ticker;
var gameStarted = false, gameOver = false, playAgain = false;
var gameBg, startGrill, reload, startText, startTextClone, startText2;
var startHat, spatula, armLeft, armRight, timeBar, timeBarBg, timeClock, scoreText;
var burger1, burger2, burger3, burger4, burger5;
var flippable = true, flipping = false, empty = false;
var leftArmOut = false, rightArmOut = false, leftArmScore = false, rightArmScore = false, leftArmTimeout = false, rightArmTimeout = false;
var burgers = 4; // 5 max ammo, 1 starts loaded
var score = 0, lastBarWidth = 450;
var timestamp1, timestamp2, leftRetractTimeout, rightRetractTimeout;

function init(){
    canvas = document.getElementById("stage");     
    stage = new createjs.Stage(canvas);

	createjs.Touch.enable(stage);
	
    // grab canvas width and height for later calculations
	w = stage.canvas.width;
	h = stage.canvas.height;
    
    var manifest = [
		{src: "images/game-bg.jpg", id: "gamebg"},
		//{src: "images/grassbg.png", id: "grassbg"},
		//{src: "images/text1.png", id: "text"},
		//{src: "images/grill.png", id: "grill"},
		{src: "images/burger.png", id: "burger"},
		{src: "images/hat.png", id: "hat"},
		//{src: "images/bun.png", id: "topBun"},
		//{src: "images/bun-bottom.png", id: "bottomBun"},
		{src: "images/arm2.png" , id: "armRight"},
		{src: "images/arm2-burger.png" , id: "armRight2"},
		{src: "images/baddieone.png", id: "armLeft"},
		{src: "images/baddieone-burger.png", id: "armLeft2"},
		//{src: "images/arm0001.png", id: "spatula1"}, 
		{src: "images/arm-spritesheet2.png", id: "armSprite"},	
		{src: "images/time-clock.png", id: "timeClock"},
		{src: "images/reload0021.png", id: "reload"}
    ];

    loader = new createjs.LoadQueue(false);
    loader.on("complete", startScreen, this);
    loader.loadManifest(manifest);
	
	// load sounds
	createjs.Sound.registerSound("audio/sizzle.wav", "sizzle");
	createjs.Sound.registerSound("audio/squish1.wav", "squish1");
	createjs.Sound.registerSound("audio/squish2.wav", "squish2");
	createjs.Sound.registerSound("audio/music.wav", "music");
}

function startScreen() {
	
	setTimeout(function() {
		$("#start-screen").show(0);
		$("#start-screen").fadeTo(500, 1, function() {
			$("#loading-screen").hide(0);
		});
	}, 500);

}


function main() {	
	//stage.removeAllChildren();
	//stage.removeAllEventListeners();
	
	setTimeout(function() {
		$("#game-screen").show(0);
		$("#game-screen").fadeTo(0, 1, function() {
			$("#start-screen").hide(0);
		});
	}, 500);

	gameStarted = true;
	timestamp1 = new Date();
	
	gameBg = new createjs.Bitmap(loader.getResult("gamebg").src);
    gameBg.x = 0;
    gameBg.y = 0;
	stage.addChild(gameBg);
	
	/*var grill = loader.getResult("grill").src;
    startGrill = new createjs.Bitmap(grill);
    startGrill.x = 220;
    startGrill.y = 400;
	stage.addChild(startGrill);*/
	
    reload = new createjs.Bitmap(loader.getResult("reload").src);
    reload.x = 234;
    reload.y = 411;
	reload.visible = false;
	stage.addChild(reload);
	
	reload.on("click", function (event) {
		if (burgers < 1 && flippable == false && flipping == false) {
			restockBurgers();
		}
	});
    
	// start burgers!
    var burger = loader.getResult("burger").src;
	burger2 = new createjs.Bitmap(burger);
	burger2.x = 345;
    burger2.y = 403;
	burger2.scaleX = burger2.scaleY = burger2.scale = 0.55;
	stage.addChild(burger2);
	
    burger1 = new createjs.Bitmap(burger);
	burger1.x = 275;
    burger1.y = 405;
	burger1.scaleX = burger1.scaleY = burger1.scale = 0.55;
	stage.addChild(burger1);
	
	burger3 = new createjs.Bitmap(burger);
	burger3.x = 255;
    burger3.y = 430;
	burger3.scaleX = burger3.scaleY = burger3.scale = 0.6;
	stage.addChild(burger3);
	
	burger5 = new createjs.Bitmap(burger);
	burger5.x = 405;
    burger5.y = 415;
	burger5.scaleX = burger5.scaleY = burger5.scale = 0.6;
	stage.addChild(burger5);
	
	burger4 = new createjs.Bitmap(burger);
	burger4.x = 330;
    burger4.y = 433;
	burger4.scaleX = burger4.scaleY = burger4.scale = 0.6;
	burger4.visible = false; // first ammo is already loaded
	stage.addChild(burger4);
	// end burgers!
	
	var scoreBg = new createjs.Shape();
	scoreBg.graphics.setStrokeStyle(2, "round").beginStroke("darkgreen").beginFill("green").drawRect(0, 0, 70, 70);
	scoreBg.x = 250;
	scoreBg.y = 136;
	scoreBg.regX = 35;
	scoreBg.regY = 35;
	stage.addChild(scoreBg);
	
	var scoreTitleText = new createjs.Text("SCORE", "bold 15px Arial", "yellow");
    scoreTitleText.x = 250;
    scoreTitleText.y = 120;
	scoreTitleText.textAlign = "center";
	scoreTitleText.maxWidth = 70;
    scoreTitleText.textBaseline = "alphabetic";
	scoreTitleText.shadow = new createjs.Shadow("#000000", 0, 1, 2);
	stage.addChild(scoreTitleText);
	
	scoreText = new createjs.Text("0", "32px Arial", "white");
    scoreText.x = 250;
    scoreText.y = 157;
	scoreText.textAlign = "center";
    scoreText.textBaseline = "alphabetic";
	scoreText.shadow = new createjs.Shadow("#000000", 0, 1, 2);
	stage.addChild(scoreText);
	
	armLeft = new createjs.Bitmap(loader.getResult("armLeft").src);
	armLeft2 = new createjs.Bitmap(loader.getResult("armLeft2").src);
	armLeft.x = -305; // 305 img width
    armLeft.y = 140;
	armLeft.scaleX = armLeft.scaleY = armLeft.scale = 1;
	stage.addChild(armLeft);
	
	armRight = new createjs.Bitmap(loader.getResult("armRight").src);
	armRight2 = new createjs.Bitmap(loader.getResult("armRight2").src);
	armRight.x = 500; // 280 img width
    armRight.y = 220;
	armRight.scaleX = armRight.scaleY = armRight.scale = 1;
	stage.addChild(armRight);
    
    var hat = loader.getResult("hat").src;
    startHat = new createjs.Bitmap(hat);
	startHat.x = 10;
    startHat.y = 350;
	stage.addChild(startHat);
	
	timeBarBg = new createjs.Shape();
	timeBarBg.graphics.setStrokeStyle(2, "round").beginStroke("#000").beginFill("#333").drawRect(0, 0, 450, 12);
	timeBarBg.x = 40;
	timeBarBg.y = 72;
	stage.addChild(timeBarBg);
	
	timeBar = new createjs.Shape();
	timeBar.graphics.setStrokeStyle(2, "round").beginStroke("darkblue").beginLinearGradientFill(["white", "blue", "darkblue"], [0, 0.8, 1], 0, 0, 0, 12).drawRect(0, 0, 450, 12);
	timeBar.x = 40;
	timeBar.y = 72;
	stage.addChild(timeBar);
	
	timeClock = new createjs.Bitmap(loader.getResult("timeClock").src);
	timeClock.x = 25; // 280 img width
    timeClock.y = 77;
	timeClock.regX = timeClock.regY = 50;
	timeClock.scaleX = timeClock.scaleY = timeClock.scale = 0.4;
	stage.addChild(timeClock);
	// start rotation loop
	createjs.Tween.get(timeClock, {loop: true})
		.to({rotation: 360}, 1000)
	

	var spatulaData = {
		framerate: 25,
		"images": [loader.getResult("armSprite")],
		"frames": {"width": 413, "height": 512, "count": 12},
		"animations": {
			"flip": [0, 5],
			"reload1": [6, 8],
			"reload2": [9, 11],
			"empty": {
				frames: [8, 7, 6, 6, 7, 8],
				speed: 0.7
			}
		}
	};
	
	var spriteSheet = new createjs.SpriteSheet(spatulaData);
	spatula = new createjs.Sprite(spriteSheet);
	spatula.x = startHat.x + 55;
    spatula.y = 170;
	spatula.scaleX = spatula.scaleY = spatula.scale = 0.95;
	stage.addChild(spatula);
	
	spatula.addEventListener("animationend", handleAnimationEnd);
	function handleAnimationEnd(event) {
		if (event.name == "flip") {
			spatula.gotoAndPlay("reload1");
			flipping = false;
			
			if (leftArmScore == true) {
				leftArmScore = false;
				if (leftArmOut == true) {
					score = score + 1;
					clearTimeout(leftRetractTimeout);
					
					if (Math.floor((Math.random() * 100) + 1) <= 50) {
						var squish1 = createjs.Sound.play("squish1");
						squish1.volume = 0.7;
					} else {
						var squish2 = createjs.Sound.play("squish2");
						squish2.volume = 0.7;
					}
					
					var armLeftClone = armLeft.clone();
					createjs.Tween.get(armLeft, {loop: false})
						.to({image: armLeft2.image}, 0)
						//.wait(200)
						.to({x: -305}, 300, createjs.Ease.getPowInOut(2))
						.to({image: armLeftClone.image}, 0);
					leftArmOut = false;
					leftArmTimeout = true;
					setTimeout(function() {
						leftArmTimeout = false;
					}, 600);
				}
				
			} else if (rightArmScore == true) {
				rightArmScore = false;
				if (rightArmOut == true) {
					score = score + 1;
					clearTimeout(rightRetractTimeout);
					
					if (Math.floor((Math.random() * 100) + 1) <= 50) {
						var squish1 = createjs.Sound.play("squish1");
						squish1.volume = 0.7;
					} else {
						var squish2 = createjs.Sound.play("squish2");
						squish2.volume = 0.7;
					}
					
					var armRightClone = armRight.clone();
					createjs.Tween.get(armRight, {loop: false})
						.to({image: armRight2.image}, 0)
						//.wait(200)
						.to({x: 500}, 300, createjs.Ease.getPowInOut(2))
						.to({image: armRightClone.image}, 0);
					rightArmOut = false;
					rightArmTimeout = true;
					setTimeout(function() {
						rightArmTimeout = false;
					}, 600);
				}
			}
			
		} else if (event.name == "reload1") {
			if (burgers > 0) {
				spatula.gotoAndPlay("reload2");
				removeBurger(burgers);
				burgers = burgers - 1;
			} else {
				reload.visible = true;
				spatula.gotoAndPlay("empty");
			}
			
		} else if (event.name == "reload2") {
			spatula.gotoAndStop("flip");
			flippable = true;
			
		} else if (event.name == "empty") {
			if (burgers > 0) {
				spatula.gotoAndPlay("reload2");
				removeBurger(burgers);
				burgers = burgers - 1;
				empty = false;
			} else {
				empty = true;
				reload.visible = true;
				spatula.gotoAndPlay("empty");
			}
		}
		
	}		
	
	stage.addEventListener("stagemousedown", handleClick);
	function handleClick(event) {
		var x = event.stageX - 230;
		createjs.Tween.get(startHat, {loop: false, override:true})
			.to({x: x}, 50, createjs.Ease.getPowInOut(2));
		createjs.Tween.get(spatula, {loop: false, override:true})
			.to({x: x + 55}, 50, createjs.Ease.getPowInOut(2));
			
		if (flippable == true) {
			
			spatula.gotoAndPlay("flip");
			flippable = false;
			flipping = true;			
			
			if (leftArmOut == true && event.stageX <= 195 && event.stageX >= 120) {
				leftArmScore = true;
			} else if (rightArmOut == true && event.stageX <= 380 && event.stageX >= 305) {
				rightArmScore = true;
			}
		}
		
	}


	//stage.enableMouseOver(10);
	
	if (playAgain == false) {
		createjs.Ticker.setFPS(30);
		ticker = createjs.Ticker.on("tick", tick);
	}
	
	var music = createjs.Sound.play("music");
	music.volume = 0.1;
	var sizzle = createjs.Sound.play("sizzle");
	sizzle.volume = 0.5;
}

function endScreen() {
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	
	createjs.Sound.stop();
	//createjs.Ticker.off("tick", ticker);
	gameStarted = false;
	
	$("#final-score").html(score);
	
	setTimeout(function() {
		$("#end-screen").show(0);
		$("#end-screen").fadeTo(0, 1, function() {
			$("#game-screen").hide(0);
		});
	}, 500);
	
}

function removeBurger(ammoCount) {
	var burgerNum = 5 - ammoCount;
	var currentBurger;
	
	switch (burgerNum) {
		case 0: currentBurger = burger4; break;
		case 1: currentBurger = burger3; break;
		case 2: currentBurger = burger5; break;
		case 3: currentBurger = burger2; break;
		case 4: currentBurger = burger1; break;
		default: return false;
	}
	
	currentBurger.visible = false;
}

function restockBurgers() {
	burgers = 5;
	
	burger1.visible = true;
	burger2.visible = true;
	burger3.visible = true;
	burger4.visible = true;
	burger5.visible = true;
	
	var sizzle = createjs.Sound.play("sizzle");
	sizzle.volume = 0.5;
	
	reload.visible = false;
}

function retractArmLeft(timeout) {
	if (leftArmOut == true) {	
		leftArmOut = false;
		createjs.Tween.get(armLeft, {loop: false})
			.to({x: -305}, 300, createjs.Ease.getPowInOut(2));
			
		leftArmTimeout = true;
		setTimeout(function() {
			leftArmTimeout = false;
		}, timeout);
	}
}

function retractArmRight(timeout) {
	if (rightArmOut == true) {	
		rightArmOut = false;
		createjs.Tween.get(armRight, {loop: false})
			.to({x: 500}, 300, createjs.Ease.getPowInOut(2));
		
		rightArmTimeout = true;
		setTimeout(function() {
			rightArmTimeout = false;
		}, timeout);
	}
}



function tick(event) {
	if (gameStarted == true) {			
			// handle burger flipping logic
		if (stage.mouseX != 0) {
			var x = stage.mouseX - 230;
			
			if (flippable == true) {
				createjs.Tween.get(startHat, {loop: false})
						.to({x: x}, 50, createjs.Ease.getPowInOut(2));
				createjs.Tween.get(spatula, {loop: false})
					.to({x: x + 55}, 50, createjs.Ease.getPowInOut(2));
			} else {
				if (burgers > 0) {
					if (flipping == false) {
						createjs.Tween.get(startHat, {loop: false})
							.to({x: x}, 200, createjs.Ease.getPowInOut(2));
						createjs.Tween.get(spatula, {loop: false})
							.to({x: x + 55}, 200, createjs.Ease.getPowInOut(2));
					} else {
						
					}
				} else {
					if (flipping == false) {
						if (empty == true) {					
							createjs.Tween.get(startHat, {loop: false})
								.to({x: x}, 50, createjs.Ease.getPowInOut(2));
							createjs.Tween.get(spatula, {loop: false})
								.to({x: x + 55}, 50, createjs.Ease.getPowInOut(2));
						} else {
							createjs.Tween.get(startHat, {loop: false})
								.to({x: x}, 200, createjs.Ease.getPowInOut(2));
							createjs.Tween.get(spatula, {loop: false})
								.to({x: x + 55}, 200, createjs.Ease.getPowInOut(2));
						}
					} else {
						
					}
				}
			}
		}
		
		// handle random bun plates
		var rand1 = Math.floor((Math.random() * 80) + 1); // 1 to 80
		var rand2 = Math.floor((Math.random() * 1000) + 1000); // 1000 to 2000
		
		if (rand1 == 1 && leftArmOut == false && leftArmTimeout == false) {
			createjs.Tween.get(armLeft, {loop: false})
				.to({x: -80}, 300, createjs.Ease.getPowInOut(2));
				
			leftArmOut = true;
			leftRetractTimeout = setTimeout(function() {
				retractArmLeft(600);
			}, rand2);
		} else if (rand1 == 2 && rightArmOut == false && rightArmTimeout == false) {
			createjs.Tween.get(armRight, {loop: false})
				.to({x: 300}, 300, createjs.Ease.getPowInOut(2));
				
			rightArmOut = true;
			rightRetractTimeout = setTimeout(function() {
				retractArmRight(600);
			}, rand2);
		}
		
		// handle game timer
		timestamp2 = new Date();
		var barRatio = (timestamp2 - timestamp1) / (30 * 1000); // 30 seconds time limit
		var barWidth = Math.round(450 - (barRatio * 450));
		if (barWidth > 0) {
			//console.log(barWidth);
			//console.log(lastBarWidth);
			if (barWidth < lastBarWidth) {
				lastBarWidth = barWidth;
				timeBar.graphics.clear().setStrokeStyle(2, "round").beginStroke("darkblue").beginLinearGradientFill(["white", "blue", "darkblue"], [0, 0.8, 1], 0, 0, 0, 12).drawRect(0, 0, barWidth, 12);
			}
		} else {
			gameOver = true;
		}
		
		// update score display
		var scoreStr = score.toString();
		if (scoreText.text !== scoreStr) {
			scoreText.text = scoreStr;
		}
		
		stage.update(event);
		
		if (gameOver == true) {
			endScreen();
		}
	}
}