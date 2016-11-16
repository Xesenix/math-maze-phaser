'use strict';
/* global Phaser */
var _ = require('lodash');
var LabelButton = require('../components/label_button.js');
var MuteButton = require('../components/mute_button.js');
var Localize = require('localize');
var localization = new Localize({
	'Score: $[1]': {
        pl: 'Punkty: $[1]'
    },
    'Logged in as: ': {
        pl: 'Zalogowany jako: '
    },
    'Easy (numbers 1-3)': {
        pl: 'Łatwy (cyfry 1-3)'
    },
    'Medium (numbers 1-5)': {
        pl: 'Średni (cyfry 1-5)'
    },
	'Hard (numbers 1-7)': {
		pl: 'Trudny (cyfry 1-7)'
	},
	'Insane (numbers 1-9)': {
		pl: 'Szalony (cyfry 1-9)'
	},
	'unlocked level $[1]': {
		pl: 'odblokowany poziom $[1]'
	},
	'Reset progress': {
		pl: 'Zresetuj postęp'
	}
});

function Menu() {}

Menu.prototype = {
	init: function() {
		this.menuItemIndex = 0;
		
		localization.setLocale(this.game.lang || 'en');
	},
	preload: function() {

	},
	create: function() {
		this.setupKeyboard();
		this.createInterface();
	},
	setupKeyboard: function() {
		this.easyKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		this.easyKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.easy.unlocked, this.game.mode.easy);}, this));
		
		this.mediumKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		this.mediumKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.medium.unlocked, this.game.mode.medium);}, this));
		
		this.hardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
		this.hardKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.hard.unlocked, this.game.mode.hard);}, this));
		
		this.insaneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
		this.insaneKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.insane.unlocked, this.game.mode.insane);}, this));
	},
	createMenuButton: function(label, callback) {
		var button = new LabelButton(this.game, this.world.centerX, 210 + 80 * (this.menuItemIndex++), 'btn', label, callback, this, this);
		button.anchor.setTo(0.5, 0.5);
		button.width = 360;	
		button.height = 70;
		button.label.setStyle({ font: '20px ' + this.game.theme.font, fill: '#000000', align: 'center' }, true);
		
		this.game.world.add(button);
		
		return button;
	},
	createBackground: function() {
		this.background = this.game.add.graphics(0, 0);
		this.background.beginFill(0x0a2d40);
		this.background.drawRect(30, 0, this.game.world.width - 60, this.game.world.height);
		this.background.endFill();
		this.background.beginFill(0x0c3953);
		this.background.drawRect(60, 0, this.game.world.width - 120, this.game.world.height);
		this.background.endFill();
		
		this.game.add.tween(this.background).from({ y: this.game.world.height, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		
		this.topbar = this.game.add.graphics(0, 0);
		this.topbar.beginFill(0x006030);
		this.topbar.drawRect(0, 0, this.game.world.width, 80);
		this.topbar.endFill();
		this.topbar.beginFill(0x008050);
		this.topbar.drawRect(0, 80, this.game.world.width, 40);
		this.topbar.endFill();
		
		this.game.add.tween(this.topbar).from({ x: this.game.world.width, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
	},
	createMenu: function() {
		this.easyButton = this.createMenuButton(
			localization.translate('Easy (numbers 1-3)') + '\n' + localization.translate('unlocked level $[1]', this.game.mode.easy.unlocked), 
			_.bind(function() { this.game.state.start('play', true, false, this.game.mode.easy.unlocked, this.game.mode.easy);}, this)
		);
		this.easyButton.tint = 0xffbb60;
		
		this.mediumButton = this.createMenuButton(
			localization.translate('Medium (numbers 1-5)') + '\n' + localization.translate('unlocked level $[1]', this.game.mode.medium.unlocked),
			_.bind(function() {this.game.state.start('play', true, false, this.game.mode.medium.unlocked, this.game.mode.medium);}, this)
		);
		this.mediumButton.tint = 0xffbb60;
		
		this.hardButton = this.createMenuButton(
			localization.translate('Hard (numbers 1-7)') + '\n' + localization.translate('unlocked level $[1]', this.game.mode.hard.unlocked),
			_.bind(function() {this.game.state.start('play', true, false, this.game.mode.hard.unlocked, this.game.mode.hard);}, this)
		);
		this.hardButton.tint = 0xffbb60;
		
		this.insaneButton = this.createMenuButton(
			localization.translate('Insane (numbers 1-9)') + '\n' + localization.translate('unlocked level $[1]', this.game.mode.insane.unlocked),
			_.bind(function() {this.game.state.start('play', true, false, this.game.mode.insane.unlocked, this.game.mode.insane);}, this)
		);
		this.insaneButton.tint = 0xffbb60;
		
		this.resetButton = this.createMenuButton(localization.translate('Reset progress'), _.bind(this.resetProgress, this));
		this.resetButton.tint = 0xff4040;
		this.resetButton.y += 20;
		
		this.game.add.tween(this.easyButton)
			.from({ x: -320}, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		this.game.add.tween(this.mediumButton)
			.from({ x: -320}, 500, Phaser.Easing.Linear.NONE, true, 100, 0, false);
		this.game.add.tween(this.hardButton)
			.from({ x: -320}, 500, Phaser.Easing.Linear.NONE, true, 200, 0, false);
		this.game.add.tween(this.insaneButton)
			.from({ x: -320}, 500, Phaser.Easing.Linear.NONE, true, 300, 0, false);
		this.game.add.tween(this.resetButton)
			.from({ y: this.game.world.height + 40 }, 500, Phaser.Easing.Linear.NONE, true, 800, 0, false);
	},
	createInterface: function() {
		this.createBackground();
		this.createMenu();
		
		this.titleLabel = this.game.add.text(
			this.game.world.centerX, 
			40,
			'Math Maze',
			{ font: '64px ' + this.game.theme.font, fill: '#ffffff', align: 'center'}
		);
		this.titleLabel.anchor.setTo(0.5, 0.5);

		this.scoreLabel = this.game.add.text(
			this.game.world.centerX, 
			100, 
			localization.translate('Score: $[1]', _.sum(_.map(this.game.mode, 'points'))),
			{ font: '40px ' + this.game.theme.font, fill: '#ffffff', align: 'center'}
		);
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		
		this.muteButton = new MuteButton(this.game, 24, this.world.height - 24, 'mute');
		this.muteButton.anchor.setTo(0.5, 0.5);
		this.muteButton.width = 32;
		this.muteButton.height = 32;
		
		this.world.add(this.muteButton);

		if (typeof(this.game.service.user) !== 'undefined' && this.game.service.user !== null && !this.game.service.user.guest) {
			this.loginLabel = this.game.add.text(
				this.game.world.centerX, 
				150, 
				localization.translate('Logged in as: ') + this.game.service.user.username,
				{ font: '24px ' + this.game.theme.font, fill: '#ffffff', align: 'center'}
			);
			this.loginLabel.anchor.setTo(0.5, 0.5);
			this.game.add.tween(this.loginLabel).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1500, 0, false);
		}
		
		this.game.add.tween(this.titleLabel).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 800, 0, false);
		this.game.add.tween(this.scoreLabel).from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 1200, 0, false);
	},
	resetProgress: function() {
		this.game.mode.easy.unlocked = 1;
		this.game.mode.easy.points = 0;
		this.game.mode.medium.unlocked = 1;
		this.game.mode.medium.points = 0;
		this.game.mode.hard.unlocked = 1;
		this.game.mode.hard.points = 0;
		this.game.mode.insane.unlocked = 1;
		this.game.mode.insane.points = 0;
		
		this.easyButton.label.text = localization.translate('Easy (numbers 1-3)') +
			'\n' + localization.translate('unlocked level $[1]', this.game.mode.easy.unlocked);
		this.mediumButton.label.text = localization.translate('Medium (numbers 1-5)') +
			'\n' + localization.translate('unlocked level $[1]', this.game.mode.medium.unlocked);
		this.hardButton.label.text = localization.translate('Hard (numbers 1-7)') +
			'\n' + localization.translate('unlocked level $[1]', this.game.mode.hard.unlocked);
		this.insaneButton.label.text = localization.translate('Insane (numbers 1-9)') +
			'\n' + localization.translate('unlocked level $[1]', this.game.mode.insane.unlocked);
		
		this.scoreLabel.text = localization.translate('Score: $[1]', _.sum(_.map(this.game.mode, 'points')));
		
		this.game.add.tween(this.scoreLabel)
			.from({ x: this.scoreLabel.x - 10}, 100, Phaser.Easing.Linear.InOut, true, 0, 1, true);
		this.game.add.tween(this.easyButton)
			.to({ x: this.easyButton.x - 10}, 100, Phaser.Easing.Linear.InOut, true, 50, 1, true);
		this.game.add.tween(this.mediumButton)
			.to({ x: this.mediumButton.x - 10}, 100, Phaser.Easing.Linear.InOut, true, 100, 1, true);
		this.game.add.tween(this.hardButton)
			.to({ x: this.hardButton.x - 10}, 100, Phaser.Easing.Linear.InOut, true, 150, 1, true);
		this.game.add.tween(this.insaneButton)
			.to({ x: this.insaneButton.x - 10}, 100, Phaser.Easing.Linear.InOut, true, 200, 1, true);
		
		this.game.dataStorage.setUserData('gameSave', {});
	},
	update: function() {

	}
};

module.exports = Menu;
