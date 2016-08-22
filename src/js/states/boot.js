/* global window */
'use strict';

function Boot() {
}

Boot.prototype = {
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
	},
	create: function() {
		this.game.input.maxPointers = 1;
		this.game.state.start('preload');
		
		window.WebFontConfig = {
			google: {
				families: ['VT323']
			}
		};
	}
};

module.exports = Boot;
