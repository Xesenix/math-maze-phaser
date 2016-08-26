'use strict';
/* global Phaser */
var md5 = require('js-md5');
var _ = require('lodash');
var Localize = require('localize');
var localization = new Localize({
    'Perfect!': {
        pl: 'Doskonale!'
    },
    'Great!': {
        pl: 'Wspaniale!'
    },
    'Succes!': {
        pl: 'Wygrana!'
    },
	'Fail': {
		pl: 'Porażka'
	},
    'Level $[1] Completed!': {
        pl: 'Poziom $[1] Zakończony!'
    },
	'Number of steps bonus x2': {
		pl: 'Bonus za liczbę kroków x2'
	},
	'End position bonus x2': {
		pl: 'Bonus za pozycję końcową x2'
	},
	'Base points $[1]': {
		pl: 'Bazowa punktacja $[1]'
	},
	'You earned $[1] points': {
		pl: 'Otrzymałeś $[1] punktów'
	},
	'Click Space to play next level': {
		pl: 'Wciśnij Spację aby kontynuować'
	},
	'Click R to repeat for better score!': {
		pl: 'Wciśnij R aby powtórzyć dla lepszego wyniku!'
	},
	'Click Space to repeat level $[1]': {
		pl: 'Wciśnij Spację aby powtórzyć poziom $[1]'
	},
	'You overshot $[1] target $[2]!': {
		pl: 'Zbyt duży wynik $[1] cel $[2]!'
	},
	'Repeate (R)': {
		pl: 'Powtórz (R)'
	},
	'Menu (ESC)': {
		pl: 'Menu (ESC)'
	},
	'Next (Space)': {
		pl: 'Następny (Space)'
	}
});

var LabelButton = require('../components/label_button.js');

function Finish() {}

Finish.prototype = {
	preload: function () {
	
	},
	init: function(level, result, target, difficulty) {
		this.difficulty = difficulty;
		this.level = level;
		this.result = result;
		this.target = target;
		
		this.points = 0;
		
		localization.setLocale(this.game.lang || 'en');
	},
	create: function () {
		this.createBackground();
		var bonus = '';
		
		this.nextKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.nextKey.onDown.add(_.bind(this.next, this));
		
		this.repeatKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.repeatKey.onDown.add(_.bind(this.repeat, this));
		
		this.restartButton = new LabelButton(
			this.game,
			this.world.centerX - 5,
			this.world.height - 10,
			'btn',
			localization.translate('Repeate (R)'),
			_.bind(this.repeat, this),
			this
		);
		this.restartButton.anchor.setTo(1, 1);
		this.restartButton.width = 200;	
		this.restartButton.height = 60;
		this.restartButton.tint = 0xffbb60;
		this.restartButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
		this.game.world.add(this.restartButton);
		
		this.menuButton = new LabelButton(
			this.game,
			this.world.centerX + 5,
			this.world.height - 10,
			'btn',
			localization.translate('Menu (ESC)'),
			_.bind(this.menu, this),
			this
		);
		this.menuButton.anchor.setTo(0, 1);
		this.menuButton.width = 200;	
		this.menuButton.height = 60;
		this.menuButton.tint = 0xffbb60;
		this.menuButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
		this.game.world.add(this.menuButton);
		
		this.game.add.tween(this.menuButton).from({ y: this.menuButton.y + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		this.game.add.tween(this.restartButton).from({ y: this.restartButton.y + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		
		if (this.result.value === this.target.value) {
			this.points = this.difficulty.growthPoints * this.level;
			
			this.restartButton.x = this.world.centerX - 130;
			this.menuButton.x = this.world.centerX + 130;
			
			this.nextButton = new LabelButton(
				this.game,
				this.world.centerX,
				this.world.height - 10,
				'btn',
				localization.translate('Next (Space)'),
				_.bind(this.next, this),
				this
			);
			this.nextButton.anchor.setTo(0.5, 1);
			this.nextButton.width = 240;	
			this.nextButton.height = 60;
			this.nextButton.tint = 0xffbb60;
			this.nextButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
			this.game.world.add(this.nextButton);
		
			this.game.add.tween(this.nextButton).from({ y: this.nextButton.y + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
			
			if (this.result.steps <= this.target.steps) {
				this.points *= 2;
				bonus += '\n' + localization.translate('Number of steps bonus x2');
				if (this.result.position.x === this.target.position.x && this.result.position.y === this.target.position.y) {
					bonus += '\n' + localization.translate('End position bonus x2');
					this.points *= 2;
					this.titleText = this.game.add.text(
						this.game.world.centerX,
						100,
						localization.translate('Perfect!'),
						{ font: '64px ' + this.game.theme.font, fill: '#ffaa00', align: 'center'}
					);
				} else {
					this.titleText = this.game.add.text(
						this.game.world.centerX,
						100,
						localization.translate('Great!'),
						{ font: '64px ' + this.game.theme.font, fill: '#ff6000', align: 'center'}
					);
				}
			} else {
				if (this.result.position.x === this.target.position.x && this.result.position.y === this.target.position.y) {
					bonus += '\n' + localization.translate('End position bonus x2');
					this.points *= 2;
					this.titleText = this.game.add.text(
						this.game.world.centerX,
						100,
						localization.translate('Great!'),
						{ font: '64px ' + this.game.theme.font, fill: '#ff6000', align: 'center'}
					);
				} else {
					this.titleText = this.game.add.text(
						this.game.world.centerX,
						100,
						localization.translate('Succes!'),
						{ font: '64px ' + this.game.theme.font, fill: '#80ff00', align: 'center'}
					);
				}
			}
			
			this.titleText.anchor.setTo(0.5, 0.5);

			this.congratsText = this.game.add.text(
				this.game.world.centerX,
				200,
				localization.translate('Level $[1] Completed!',  this.level),
				{ font: '48px ' + this.game.theme.font, fill: '#ffffff', align: 'center'}
			);
			this.congratsText.anchor.setTo(0.5, 0.5);

			this.bonusText = this.game.add.text(
				this.game.world.centerX,
				300,
				localization.translate('Base points $[1]', (this.difficulty.growthPoints * this.level)) + bonus,
				{ font: '24px ' + this.game.theme.font, fill: '#ffffff', align: 'center'}
			);
			this.bonusText.anchor.setTo(0.5, 0.5);

			this.pointsText = this.game.add.text(
				this.game.world.centerX,
				380,
				localization.translate('You earned $[1] points', this.points),
				{ font: '40px ' + this.game.theme.font, fill: '#ffffff', align: 'center'}
			);
			this.pointsText.anchor.setTo(0.5, 0.5);

			this.instructionText = this.game.add.text(
				this.game.world.centerX,
				480,
				localization.translate('Click Space to play next level') + '\n' + localization.translate('Click R to repeat for better score!'),
				{ font: '24px ' + this.game.theme.font, fill: '#dddddd', align: 'center'}
			);
			this.instructionText.anchor.setTo(0.5, 0.5);
			
			this.game.add.tween(this.titleText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
			this.game.add.tween(this.congratsText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
			this.game.add.tween(this.bonusText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 800, 0, false);
			this.game.add.tween(this.pointsText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1200, 0, false);
			this.game.add.tween(this.instructionText).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1500, 0, false);
		} else {
			this.titleText = this.game.add.text(
				this.game.world.centerX,
				100,
				localization.translate('Fail'),
				{ font: '64px ' + this.game.theme.font, fill: '#ff0000', align: 'center'}
			);
			this.titleText.anchor.setTo(0.5, 0.5);

			this.congratsText = this.game.add.text(
				this.game.world.centerX,
				300,
				localization.translate('You overshot $[1] target $[2]!', this.result.value, this.target.value),
				{ font: '48px ' + this.game.theme.font, fill: '#ffffff', align: 'center'}
			);
			this.congratsText.anchor.setTo(0.5, 0.5);

			this.instructionText = this.game.add.text(
				this.game.world.centerX,
				480,
				localization.translate('Click Space to repeat level $[1]', this.level),
				{ font: '24px ' + this.game.theme.font, fill: '#dddddd', align: 'center'}
			);
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
	menu: function () {
		this.game.state.start('menu');
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
				
				this.game.service.setUserData('gameSave', gameSave);
			}
			
			this.game.state.start('play', true, false, this.level + 1, this.difficulty);
		} else {
			this.game.state.start('play', true, false, this.level, this.difficulty);
		}
	}
};

module.exports = Finish;
