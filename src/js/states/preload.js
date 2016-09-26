'use strict';

function Preload() {
	this.asset = null;
	this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.asset = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.load.image('math-maze-logo', 'assets/math-maze-logo.png');
		this.load.image('btn', 'assets/btn.png');
		
		this.load.audio('melody', 'assets/math_maze.ogg');
		
		this.load.spritesheet('mute', 'assets/mute.png', 64, 64);
	},
	create: function() {
		this.asset.cropEnabled = false;
	},
	update: function() {
		if (!!this.ready) {
			this.game.state.start('intro');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};

module.exports = Preload;
