'use strict';
/* global Phaser */
var _ = require('lodash');

function Finish() {}

Finish.prototype = {
	preload: function () {
	
	},
	init: function(level, result, target) {
		console.log('GameOver', level, result, target);
		this.level = level;
		this.result = result;
		this.target = target;
	},
	create: function () {
		var key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.Space);
		key1.onDown.add(_.bind(this.next, this));
		
		if (this.result.value === this.target.value) {
			if (this.result.position.x === this.target.position.x && this.result.position.y === this.target.position.y) {
				this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Perfect!', { font: '64px VT323', fill: '#ddaa00', align: 'center'});
			} else {
				this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Succes!', { font: '64px VT323', fill: '#80ff00', align: 'center'});
			}
			this.titleText.anchor.setTo(0.5, 0.5);

			this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'Level ' + this.level + ' Completed!', { font: '48px VT323', fill: '#ffffff', align: 'center'});
			this.congratsText.anchor.setTo(0.5, 0.5);

			this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click Space to play next level', { font: '32px VT323', fill: '#ffffff', align: 'center'});
			this.instructionText.anchor.setTo(0.5, 0.5);
		} else {
			this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Fail', { font: '64px VT323', fill: '#ff0000', align: 'center'});
			this.titleText.anchor.setTo(0.5, 0.5);

			this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You overshot ' + this.result.value + ' target ' + this.target.value + '!', { font: '48px VT323', fill: '#ffffff', align: 'center'});
			this.congratsText.anchor.setTo(0.5, 0.5);

			this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click Space to repeat level ' + this.level, { font: '32px VT323', fill: '#ffffff', align: 'center'});
			this.instructionText.anchor.setTo(0.5, 0.5);
		}
	},
	update: function () {
		if (this.game.input.activePointer.justPressed()) {
			this.next();
		}
	},
	next: function () {
		console.log('continue');
		if (this.result.value === this.target.value) {
			this.game.state.start('play', true, false, this.level + 1);
		} else {
			this.game.state.start('play', true, false, this.level);
		}
	}
};

module.exports = Finish;
