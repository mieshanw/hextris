// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
	return c * ((t = t / d - 1) * t * t + 1) + b;
}

function renderText(x, y, fontSize, color, text, font) {
	if (text == 'HIGH SCORE') debugger;
	ctx.save();
	if (!font) {
		font = 'px Exo';
	}

	fontSize *= settings.scale;
	ctx.font = fontSize + font;
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
	ctx.restore();
}

function drawScoreboard() {
	if (scoreOpacity < 1) {
		scoreOpacity += 0.01;
		textOpacity += 0.01;
	}

	ctx.globalAlpha = textOpacity;
	var scoreSize = 50;
	var scoreString = String(score);
	if (scoreString.length == 6) {
		scoreSize = 43;
	} else if (scoreString.length == 7) {
		scoreSize = 35;
	} else if (scoreString.length == 8) {
		scoreSize = 31;
	} else if (scoreString.length == 9) {
		scoreSize = 27;
	}
	if (rush ==1){
		var color = "rgb(236, 240, 241)";
	}
    var fontSize = settings.platform == 'mobile' ? 35 : 30;
    var h = trueCanvas.height / 2 + gdy + 100 * settings.scale;
	if (gameState === 0) {
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "rgb(236, 240, 241)", String.fromCharCode("0xf04b"), 'px FontAwesome');
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy - 155 * settings.scale, 150, "#2c3e50", "Hextris");
		renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h, fontSize, "rgb(44,62,80)", 'Play!');
	} else if (gameState != 0 && textOpacity > 0) {
		textOpacity -= 0.05;
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "rgb(236, 240, 241)", String.fromCharCode("0xf04b"), 'px FontAwesome');
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy - 155 * settings.scale, 150, "#2c3e50", "Hextris");
		renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h, fontSize, "rgb(44,62,80)", 'Play!');
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
	} else {
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
	}

	ctx.globalAlpha = 1;
}

function clearGameBoard() {
	drawPolygon(trueCanvas.width / 2, trueCanvas.height / 2, 6, trueCanvas.width / 2, 30, hexagonBackgroundColor, 0, 'rgba(0,0,0,0)');
}

function drawPolygon(x, y, sides, radius, theta, fillColor, lineWidth, lineColor) {
	ctx.fillStyle = fillColor;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = lineColor;

	ctx.beginPath();
	var coords = rotatePoint(0, radius, theta);
	ctx.moveTo(coords.x + x, coords.y + y);
	var oldX = coords.x;
	var oldY = coords.y;
	for (var i = 0; i < sides; i++) {
		coords = rotatePoint(oldX, oldY, 360 / sides);
		ctx.lineTo(coords.x + x, coords.y + y);
		oldX = coords.x;
		oldY = coords.y;
	}

	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.strokeStyle = 'rgba(0,0,0,0)';
}

function toggleClass(element, active) {
	if ($(element).hasClass(active)) {
		$(element).removeClass(active);
	} else {
		$(element).addClass(active);
	}
}

function showText(text) {
	var messages = {
		'paused': "<div class='centeredHeader unselectable'>Game Paused</div>",
		'pausedAndroid': "<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='margin-top:50px;'><a href = 'market://details?id=com.hextris.hextrisadfree' target='_blank'>Don't like ads? Want to support the developer? Tap for the ad-free version.</a></div>",
		'start': "<div class='centeredHeader unselectable' style='line-height:80px;'>Press enter to start</div>",
	};

	if (text == 'paused') {
		if (settings.os == 'android') {
			text = 'pausedAndroid';
		}
	}

	if (text == 'gameover') {
	   //Clay('client.share.any', {text: 'Think you can beat my score of '+ score + ' in Super Cool Game?'})
		$("#gameoverscreen").fadeIn();
    	}
	$(".overlay").html(messages[text]);
	$(".overlay").fadeIn("1000", "swing");

}

function setMainMenu() {
	gameState = 4;
	canRestart = false;
	setTimeout(function() {
		canRestart = 's';
	}, 500);
	$('#restartBtn').hide();
	if ($("#pauseBtn").replace(/^.*[\\\/]/, '') == "btn_pause.svg") {
		$("#pauseBtn").attr("src","./images/btn_resume.svg");
	} else {
		$("#pauseBtn").attr("src","./images/btn_pause.svg");
	}
}

function hideText() {
	$(".overlay").fadeOut("1000", function() {
		$(".overlay").html("");
	})
}

function gameOverDisplay() {
	if(Cookies.get("visited") == null){
		settings.ending_block=true;
		if(settings.os == "android"){
			sweetAlert({
				title: "Hey we'll only bother you once ",
				text:"We do have an Android app!",
				showCancelButton: true,
				closeOnCancel: true ,
				confirmButtonText: "Take me to it!",
				},function(isConfirm){
					if(isConfirm){
						window.location.href="https://play.google.com/store/apps/details?id=com.hextris.hextris"
					}
					else{
						settings.end_block=false;
					}
				
				});
		}
		if(settings.os == "ios"){
			sweetAlert({
				title: "Hey we'll only bother you once ",
				text:"We do have an IOS app!",
				showCancelButton: true,
				closeOnCancel: true ,
				confirmButtonText: "Take me to it!",
				},function(isConfirm){
					if(isConfirm){
						window.location.href="https://itunes.apple.com/us/app/hextris/id903769553?mt=8";
					}
					else{
						settings.end_block=false;
					}
				});
		}

	}
	settings.ending_block=false;
	Cookies.set("visited",true);
	var c = document.getElementById("canvas");
	c.className = "blur";
	updateHighScores();
	if (highscores.length === 0 ){
		$("#currentHighScore").text(0);
	}
	else {
		$("#currentHighScore").text(highscores[0])
	}

	$("#gameoverscreen").fadeIn();
	$("#buttonCont").fadeIn();
	$("#container").fadeIn();
	$("#socialShare").fadeIn();
	$("#restart").fadeIn();
}

function updateHighScores (){
    $("#cScore").text(score);
    $("#1place").text(highscores[0]);
    $("#2place").text(highscores[1]);
    $("#3place").text(highscores[2]);
}
var pausable = true;
function pause(o) {
	if(!pausable){
	    return;
	}
	pausable = false;
	writeHighScores();
	var message;
	if (o) {
		message = '';
	} else {
		message = 'paused';
	}

	var c = document.getElementById("canvas");
	if (gameState == -1) {
		$('#fork-ribbon').fadeOut(150, 'linear');
		$('#restartBtn').fadeOut(150, "linear");
		$('#buttonCont').fadeOut(150, "linear");
		if ($('#helpScreen').is(':visible')) {
			$('#helpScreen').fadeOut(150, "linear");
		}

		$("#pauseBtn").attr("src", "./images/btn_pause.svg");
		$('.helpText').fadeOut(200, 'linear');
		hideText();
		setTimeout(function() {
			gameState = prevGameState;
			pausable =true;
		}, 300);
	} else if (gameState != -2 && gameState !== 0 && gameState !== 2) {
		$('#restartBtn').fadeIn(150, "linear");
		$('#buttonCont').fadeIn(150, "linear");
		$('.helpText').fadeIn(200, 'linear');
		if (message == 'paused') {
			showText(message);
		}
		$('#fork-ribbon').fadeIn(150, 'linear');
		$("#pauseBtn").attr("src","./images/btn_resume.svg");
		prevGameState = gameState;
		setTimeout(function() {
		    pausable = true;
		}, 300);
		gameState = -1;
	}
}
