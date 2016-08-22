'use strict';
/* global Phaser, localStorage */
var _ = require('lodash');

var LabelButton = require('./../components/label_button.js');

function Menu() {}

Menu.prototype = {
	init: function() {
		this.menuItemIndex = 0;
	},
	preload: function() {

	},
	create: function() {
		var style = { font: '64px VT323', fill: '#ffffff', align: 'center'};
		//this.sprite = this.game.add.sprite(this.game.world.centerX, 10, 'math-maze-logo');
		//this.sprite.anchor.setTo(0.5, 0);

		this.titleLabel = this.game.add.text(this.game.world.centerX, 40, 'Math Maze', style);
		this.titleLabel.anchor.setTo(0.5, 0.5);

		this.scoreLabel = this.game.add.text(this.game.world.centerX, 100, 'Score: ' + _.sum(_.map(this.game.mode, 'points')), { font: '48px VT323', fill: '#ffffff', align: 'center'});
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		
		this.easyKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		this.easyKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.easy.unlocked, this.game.mode.easy);}, this));
		
		this.mediumKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		this.mediumKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.medium.unlocked, this.game.mode.medium);}, this));
		
		this.hardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
		this.hardKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.hard.unlocked, this.game.mode.hard);}, this));
		
		this.insaneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
		this.insaneKey.onDown.add(_.bind(function() { this.game.state.start('play', true, false, this.game.mode.insane.unlocked, this.game.mode.insane);}, this));
		
		this.easyButton = this.createMenuButton(
			'Easy level ' + this.game.mode.easy.unlocked, 
			_.bind(function() { this.game.state.start('play', true, false, this.game.mode.easy.unlocked, this.game.mode.easy);}, this)
		);
		this.mediumButton = this.createMenuButton(
			'Medium level ' + this.game.mode.medium.unlocked,
			_.bind(function() {this.game.state.start('play', true, false, this.game.mode.medium.unlocked, this.game.mode.medium);}, this)
		);
		this.hardButton = this.createMenuButton(
			'Hard level ' + this.game.mode.hard.unlocked,
			_.bind(function() {this.game.state.start('play', true, false, this.game.mode.hard.unlocked, this.game.mode.hard);}, this)
		);
		this.insaneButton = this.createMenuButton(
			'Insane level ' + this.game.mode.insane.unlocked,
			_.bind(function() {this.game.state.start('play', true, false, this.game.mode.insane.unlocked, this.game.mode.insane);}, this)
		);
		
		this.resetButton = this.createMenuButton('Reset progress ', _.bind(this.resetProgress, this));
		this.resetButton.tint = 0xff4040;
	},
	createMenuButton: function(label, callback) {
		var button = new LabelButton(this.game, this.world.centerX, 200 + 80 * (this.menuItemIndex++), 'btn', label, callback, this, this);
		button.anchor.setTo(0.5, 0.5);
		button.width = 240;	
		button.height = 72;
		button.label.setStyle({ font: '32px VT323', fill: '#000000' }, true);
		
		this.game.world.add(button);
		
		return button;
	},
	resetProgress: function() {
		console.log('resetProgress');
		this.game.mode.easy.unlocked = 1;
		this.game.mode.easy.points = 0;
		this.game.mode.medium.unlocked = 1;
		this.game.mode.medium.points = 0;
		this.game.mode.hard.unlocked = 1;
		this.game.mode.hard.points = 0;
		this.game.mode.insane.unlocked = 1;
		this.game.mode.insane.points = 0;
		
		this.easyButton.label.text = 'Easy level ' + this.game.mode.easy.unlocked;
		this.mediumButton.label.text = 'Medium level ' + this.game.mode.medium.unlocked;
		this.hardButton.label.text = 'Hard level ' + this.game.mode.hard.unlocked;
		this.insaneButton.label.text = 'Insane level ' + this.game.mode.insane.unlocked;
		
		this.scoreLabel.text = 'Score: ' + _.sum(_.map(this.game.mode, 'points'));
		
		localStorage.setItem('gameSave', JSON.stringify({}));
	},
	update: function() {

	}
};

module.exports = Menu;
