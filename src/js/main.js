/* global Phaser */

(function () {
	var BootState = require('./states/boot.js');
	var FinishState = require('./states/finish.js');
	var MenuState = require('./states/menu.js');
	var PlayState = require('./states/play.js');
	var PreloadState = require('./states/preload.js');
	var IntroState = require('./states/intro.js');
	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

	// Game States

	game.state.add('boot', BootState);
	game.state.add('preload', PreloadState);
	game.state.add('intro', IntroState);
	game.state.add('finish', FinishState);
	game.state.add('menu', MenuState);
	game.state.add('play', PlayState);

	game.state.start('boot');

	console.log("Game started");
})();