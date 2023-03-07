const mainCanvas = document.getElementById("canvas-main");
const canvasCtx = mainCanvas.getContext("2d");
const playBtn = document.getElementById("play-btn");

mainCanvas.width = 1024;
mainCanvas.height = 512;
canvasCtx.fillStyle = "white";

var creatureSize = 4;
var creatureArea = creatureSize+creatureSize/2;
var rows = Math.floor(mainCanvas.height/creatureArea);
var columns = Math.floor(mainCanvas.width/creatureArea);
var posX = (mainCanvas.width - (columns * creatureArea))/2;
var posY = (mainCanvas.height - (rows * creatureArea))/2;
var creatureArray = [];
var neighbourCounter = 0;
var rowCounter = 0;
var colomnCounter = 0;
var creatureCounter = 0;
var isPlaying = false;

class Creature {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.isAliveThen = 0;

		if (Math.round(Math.random()) == 1) {
			this.isAliveNow = 1;
		} else {
			this.isAliveNow = 0;
		}
	}

	render() {
		if (this.isAliveNow == 1) {
			canvasCtx.beginPath();
			canvasCtx.fillRect(this.x, this.y, creatureSize, creatureSize);
			canvasCtx.fill();
		}
	}
}

function generateCreatures() {
	creatureArray = [];
	posX = (mainCanvas.width - (columns * creatureArea))/2;
	posY = (mainCanvas.height - (rows * creatureArea))/2;

	for (rowCounter = 0; rowCounter < rows; rowCounter++) {
		for (colomnCounter = 0; colomnCounter < columns; colomnCounter++) {
			creatureArray.push(new Creature(posX, posY));
			posX += creatureArea;
		}
		posX = (mainCanvas.width - (columns * creatureArea))/2;
		posY += creatureArea;
	}
}

function updateCreatures() {
	for (creatureCounter = 0; creatureCounter < creatureArray.length; creatureCounter++) {
		creatureArray[creatureCounter].isAliveThen = creatureArray[creatureCounter].isAliveNow;
	}

	for (creatureCounter = 0; creatureCounter < creatureArray.length; creatureCounter++) {
		neighbourCounter = (creatureArray[((creatureCounter - columns) - 1 + creatureArray.length) % creatureArray.length].isAliveThen +
							creatureArray[((creatureCounter - columns) + creatureArray.length) % creatureArray.length].isAliveThen +
							creatureArray[((creatureCounter - columns) + 1 + creatureArray.length) % creatureArray.length].isAliveThen +
							creatureArray[((creatureCounter - 1) + creatureArray.length) % creatureArray.length].isAliveThen +
							creatureArray[((creatureCounter + 1) + creatureArray.length) % creatureArray.length].isAliveThen +
							creatureArray[((creatureCounter + columns) - 1 + creatureArray.length) % creatureArray.length].isAliveThen +
							creatureArray[((creatureCounter + columns) + creatureArray.length) % creatureArray.length].isAliveThen +
							creatureArray[((creatureCounter + columns) + 1 + creatureArray.length) % creatureArray.length].isAliveThen)

		if (creatureArray[creatureCounter].isAliveThen == 1 && neighbourCounter == 2 || neighbourCounter == 3) {
			creatureArray[creatureCounter].isAliveNow = 1;
		} else if (creatureArray[creatureCounter].isAliveThen == 0 && neighbourCounter == 3) {
			creatureArray[creatureCounter].isAliveNow = 1;
		} else {
			creatureArray[creatureCounter].isAliveNow = 0;
		}

		neighbourCounter = 0;
	}
}

function evolve() {
	canvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	updateCreatures();
	for (creatureCounter = 0; creatureCounter < creatureArray.length; creatureCounter++) {
		creatureArray[creatureCounter].render();
	}

	if (isPlaying) {
		window.requestAnimationFrame(evolve);
	}
}

function resizeCreatures(size) {
	if (!isPlaying) {
		creatureSize = parseInt(size);
		creatureArea = creatureSize+creatureSize/2;
		rows = Math.floor(mainCanvas.height/creatureArea);
		columns = Math.floor(mainCanvas.width/creatureArea);
		generateCreatures();
		window.requestAnimationFrame(evolve);
	}
}

function resetWorld() {
	if (!isPlaying) {
		generateCreatures()
		window.requestAnimationFrame(evolve);
	}
}

function playPause() {
	if (isPlaying) {
		isPlaying = false;
		playBtn.textContent = "PLAY";
	} else {
		isPlaying = true;
		window.requestAnimationFrame(evolve);
		playBtn.textContent = "PAUSE";
	}
}

generateCreatures();
window.requestAnimationFrame(evolve);