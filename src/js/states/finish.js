'use strict';
/* global Phaser, localStorage */
var md5 = require('js-md5');
var _ = require('lodash');

function Finish() {}

Finish.prototype = {
	preload: function () {
	
	},
	init: function(level, result, target, difficulty) {
		console.log('GameOver', level, result, target);
		this.difficulty = difficulty;
		this.level = level;
		this.result = result;
		this.target = target;
		
		this.points = 0;
	},
	create: function () {
		this.createBackground();
		var bonus = '';
		
		this.nextKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.nextKey.onDown.add(_.bind(this.next, this));
		
		this.repeatKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.repeatKey.onDown.add(_.bind(this.repeat, this));
		
		if (this.result.value === this.target.value) {
			this.points = this.difficulty.growthPoints * this.level;
			
			if (this.result.steps <= this.target.steps) {
				this.points *= 2;
				bonus += '\nStep bonus x2';
				if (this.result.position.x === this.target.position.x && this.result.position.y === this.target.position.y) {
					bonus += '\nPosition bonus x2';
					this.points *= 2;
					this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Perfect!', { font: '64px VT323', fill: '#ffaa00', align: 'center'});
				} else {
					this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Great!', { font: '64px VT323', fill: '#ff6000', align: 'center'});
				}
			} else {
				if (this.result.position.x === this.target.position.x && this.result.position.y === this.target.position.y) {
					bonus += '\nPosition bonus x2';
					this.points *= 2;
					this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Great!', { font: '64px VT323', fill: '#ff6000', align: 'center'});
				} else {
					this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Succes!', { font: '64px VT323', fill: '#80ff00', align: 'center'});
				}
			}
			
			this.titleText.anchor.setTo(0.5, 0.5);

			this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'Level ' + this.level + ' Completed!', { font: '48px VT323', fill: '#ffffff', align: 'center'});
			this.congratsText.anchor.setTo(0.5, 0.5);

			this.bonusText = this.game.add.text(this.game.world.centerX, 300, 'Base points ' + (this.difficulty.growthPoints * this.level) + bonus, { font: '32px VT323', fill: '#ffffff', align: 'center'});
			this.bonusText.anchor.setTo(0.5, 0.5);

			this.pointsText = this.game.add.text(this.game.world.centerX, 400, 'You earned ' + this.points + ' points', { font: '40px VT323', fill: '#ffffff', align: 'center'});
			this.pointsText.anchor.setTo(0.5, 0.5);

			this.instructionText = this.game.add.text(this.game.world.centerX, 500, 'Click Space to play next level\nClick R to repeat for better score!', { font: '24px VT323', fill: '#dddddd', align: 'center'});
			this.instructionText.anchor.setTo(0.5, 0.5);
			
			this.game.add.tween(this.titleText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
			this.game.add.tween(this.congratsText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
			this.game.add.tween(this.bonusText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 800, 0, false);
			this.game.add.tween(this.pointsText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1200, 0, false);
			this.game.add.tween(this.instructionText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1500, 0, false);
		} else {
			this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Fail', { font: '64px VT323', fill: '#ff0000', align: 'center'});
			this.titleText.anchor.setTo(0.5, 0.5);

			this.congratsText = this.game.add.text(this.game.world.centerX, 300, 'You overshot ' + this.result.value + ' target ' + this.target.value + '!', { font: '48px VT323', fill: '#ffffff', align: 'center'});
			this.congratsText.anchor.setTo(0.5, 0.5);

			this.instructionText = this.game.add.text(this.game.world.centerX, 500, 'Click Space to repeat level ' + this.level, { font: '24px VT323', fill: '#dddddd', align: 'center'});
			this.instructionText.anchor.setTo(0.5, 0.5);
			
			this.game.add.tween(this.titleText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
			this.game.add.tween(this.congratsText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
			this.game.add.tween(this.instructionText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1000, 0, false);
		}
	},
	createBackground: function() {
		this.background = this.game.add.graphics(0, 0);
		this.background.beginFill(0x0a2d40);
		this.background.drawRect(30, 0, this.game.world.width - 60, this.game.world.height);
		this.background.endFill();
		this.background.beginFill(0x0c3953);
		this.background.drawRect(60, 0, this.game.world.width - 120, this.game.world.height);
		this.background.endFill();
		
		//this.game.add.tween(this.background).from({ y: this.game.world.height, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		
		this.subbar = this.game.add.graphics(0, 0);
		this.subbar.beginFill(0x008050);
		this.subbar.drawRect(0, 40, this.game.world.width, 120);
		this.subbar.endFill();
		this.subbar.beginFill(0x000000);
		this.subbar.drawRect(0, 45, this.game.world.width, 110);
		this.subbar.endFill();
		
		this.game.add.tween(this.subbar).from({ y: this.subbar.y - 40 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		
		this.topbar = this.game.add.graphics(0, 0);
		this.topbar.beginFill(0x006030);
		this.topbar.drawRect(0, -40, this.game.world.width, 80);
		this.topbar.endFill();
		
		this.game.add.tween(this.topbar).from({ y: this.topbar.y + 40 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
	},
	update: function () {
		if (this.game.input.activePointer.justPressed()) {
			this.next();
		}
	},
	repeat: function () {
		this.game.state.start('play', true, false, this.level, this.difficulty);
	},
	next: function () {
		if (this.result.value === this.target.value) {
			if (this.difficulty.unlocked === this.level) {
				this.difficulty.unlocked ++;
				this.difficulty.points += this.points;
				
				var gameSave = {
					progress: {
						easy: {
							unlocked: this.game.mode.easy.unlocked,
							points: this.game.mode.easy.points
						},
						medium: {
							unlocked: this.game.mode.medium.unlocked,
							points: this.game.mode.medium.points
						},
						hard: {
							unlocked: this.game.mode.hard.unlocked,
							points: this.game.mode.hard.points
						},
						insane: {
							unlocked: this.game.mode.insane.unlocked,
							points: this.game.mode.insane.points
						}
					}
				};
				
				gameSave.hash = md5(gameSave.progress);
				
				localStorage.setItem('gameSave', JSON.stringify(gameSave));
			}
			
			this.game.state.start('play', true, false, this.level + 1, this.difficulty);
		} else {
			this.game.state.start('play', true, false, this.level, this.difficulty);
		}
	}
};

module.exports = Finish;
