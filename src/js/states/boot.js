/* global window, Phaser */
var _ = require('lodash');

function Boot() {
}

Boot.prototype = {
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
	},
	create: function() {
		this.game.input.maxPointers = 1;
		this.game.state.start('preload');
		this.game.lang = 'en';
		this.game.theme = {
			//font: 'Exo'
			font: 'Ubuntu'
		};
		
		window.WebFontConfig = {
			google: {
				//families: ['Exo::latin-ext']
				families: ['Ubuntu::latin-ext']
			}
		};
	}
};


Boot.prototype = {
	preload: function() {
		console.log('preload boot');
		this.load.image('preloader', 'assets/preloader.gif');
		
		// setup fonts and interface apperance
		this.game.theme = {
			font: 'Ubuntu'
		};
		
		window.WebFontConfig = {
			active: _.bind(function() {
				console.log('fonts ready 1/2');
				this.game.time.events.add(Phaser.Timer.SECOND, this.onFontsReady, this);
			}, this),
			google: {
				families: ['Ubuntu::latin-ext']
			}
		};
		this.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
	},
	create: function() {
		console.log('boot create');
		this.game.input.maxPointers = 1;
	},
	onFontsReady: function() {
		console.log('fonts ready 2/2');
		
		this.game.state.start('preload');
	}
};

module.exports = Boot;
