/* global Phaser */

(function () {
	var BootState = require('./states/boot.js');
	var FinishState = require('./states/finish.js');
	var MenuState = require('./states/menu.js');
	var PlayState = require('./states/play.js');
	var PreloadState = require('./states/preload.js');
	var IntroState = require('./states/intro.js');
	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
	
	var ServiceSetupState = null;
	var ServiceApi = null;
	
	switch ('kongregate') {
		case 'kongregate':
			ServiceSetupState = require('./states/kongregate.js');
			ServiceApi = require('./kongregate/api.js');
			break;
		case 'gamejolt':
			ServiceSetupState = require('./states/gamejolt.js');
			ServiceApi = require('./gamejolt/api.js');
			break;
	}
	
	game.service = ServiceApi;
	// Game States

	game.state.add('boot', BootState);
	game.state.add('service', ServiceSetupState);
	game.state.add('preload', PreloadState);
	game.state.add('intro', IntroState);
	game.state.add('finish', FinishState);
	game.state.add('menu', MenuState);
	game.state.add('play', PlayState);

	game.state.start('boot');

	console.log("Game started", game);
})();