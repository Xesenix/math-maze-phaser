'use strict';
/* global Phaser, localStorage */
var md5 = require('js-md5');
var _ = require('lodash');

var moves = [
	"P,D,L,G,P,P,D,D,P,L,L,G,P,G,L,L",
	"D,P,D,G,P,P,D,L,P,G,L,P,G,L,L,L",
	"D,D,P,P,G,L,G,P,P,D,L,L,D,L,G,G",
	"P,D,L,D,P,G,P,D,P,G,L,P,G,L,D,L,G,L"
];

var vertical = function(result, nodeValue, x, y) {
	result.realSteps ++;
	
	if (nodeValue !== 1) {
		result.steps = result.realSteps;
		result.position.x = x;
		result.position.y = y;
	}
	
	return result.value * nodeValue;
};

var horizontal = function(result, nodeValue, x, y) {
	result.realSteps ++;
	
	if (nodeValue !== 0) {
		result.steps = result.realSteps;
		result.position.x = x;
		result.position.y = y;
	}
	
	return result.value + nodeValue;
};

var easyDifficulty = {
	label: 'Easy',
	maxNumber: 3, // 2-9
	sizeX: 4,
	sizeY: 3,
	vertical: vertical,
	horizontal: horizontal,
	moves: moves
};

var mediumDifficulty = {
	label: 'Medium',
	maxNumber: 5, // 2-9
	sizeX: 4,
	sizeY: 3,
	vertical: vertical,
	horizontal: horizontal,
	moves: moves
};

var hardDifficulty = {
	label: 'Hard',
	maxNumber: 7, // 2-9
	sizeX: 4,
	sizeY: 3,
	vertical: vertical,
	horizontal: horizontal,
	moves: moves
};

var insaneDifficulty = {
	label: 'Insane',
	maxNumber: 9, // 2-9
	sizeX: 4,
	sizeY: 3,
	vertical: vertical,
	horizontal: horizontal,
	moves: moves
};

function Intro() {}

Intro.prototype = {
	init: function() {
		var gameSave = _.extend({
			hash: null,
			progress: {}
		}, JSON.parse(localStorage.getItem('gameSave')) || {});
		
		if (gameSave.hash !== md5(gameSave.progress)) {
			gameSave.progress = {};
		}
		
		this.game.mode = _.merge({
			easy: {
				growthPoints: 1,
				points: 0,
				unlocked: 1,
				config: easyDifficulty
			},
			medium: {
				growthPoints: 5,
				points: 0,
				unlocked: 1,
				config: mediumDifficulty
			},
			hard: {
				growthPoints: 10,
				points: 0,
				unlocked: 1,
				config: hardDifficulty
			},
			insane: {
				growthPoints: 20,
				points: 0,
				unlocked: 1,
				config: insaneDifficulty
			}
		}, gameSave.progress);
	},
	preload: function() {

	},
	create: function() {
		var style = { font: '64px VT323', fill: '#ffffff', align: 'center'};
		this.sprite = this.game.add.sprite(this.game.world.centerX, 180, 'math-maze-logo');
		this.sprite.anchor.setTo(0.5, 0.5);

		this.titleText = this.game.add.text(this.game.world.centerX, 360, 'Math Maze', style);
		this.titleText.anchor.setTo(0.5, 0.5);

		this.authorText = this.game.add.text(this.game.world.centerX, 420, 'Game by Xesenix', { font: '36px VT323', fill: '#ffffff', align: 'center'});
		this.authorText.anchor.setTo(0.5, 0.5);

		this.instructionsText = this.game.add.text(this.game.world.centerX, 460, 'Click anywhere to play "Math Maze"', { font: '24px VT323', fill: '#dddddd', align: 'center'});
		this.instructionsText.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.sprite).from({ y: -120 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		this.game.add.tween(this.titleText).from({ y: this.game.world.height + 40}, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		this.game.add.tween(this.authorText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1000, 0, false);
		this.game.add.tween(this.instructionsText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1500, 0, false);
	},
	update: function() {
		if (this.game.input.activePointer.justPressed()) {
			this.game.state.start('menu');
		}
	}
};

module.exports = Intro;