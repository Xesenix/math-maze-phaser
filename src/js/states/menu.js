'use strict';
/* global Phaser */

function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		var style = { font: '64px VT323', fill: '#ffffff', align: 'center'};
		this.sprite = this.game.add.sprite(this.game.world.centerX, 180, 'math-maze-logo');
		this.sprite.anchor.setTo(0.5, 0.5);

		this.titleText = this.game.add.text(this.game.world.centerX, 340, 'Math Maze', style);
		this.titleText.anchor.setTo(0.5, 0.5);

		this.instructionsText = this.game.add.text(this.game.world.centerX, 420, 'Click anywhere to play "Math Maze"', { font: '32px VT323', fill: '#ffffff', align: 'center'});
		this.instructionsText.anchor.setTo(0.5, 0.5);

		this.sprite.angle = -20;
		this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
	},
	update: function() {
		if (this.game.input.activePointer.justPressed()) {
			this.game.state.start('play');
		}
	}
};

module.exports = Menu;
