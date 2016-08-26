'use strict';
/* global window */

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

module.exports = Boot;
