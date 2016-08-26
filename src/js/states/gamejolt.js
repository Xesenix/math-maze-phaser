'use strict';
/* global document */
var _ = require('lodash');
var LabelButton = require('../components/label_button.js');
//var TextInput = require('../components/text_input.js');
var ServiceApi = require('../gamejolt/api.js');

function GamejoltSetupState() {}

GamejoltSetupState.prototype = {
	init: function() {
		ServiceApi.getUserData('save')
			.then(_.bind(this.onData, this))
			.catch(_.bind(this.onError, this));
	},
	preload: function() {

	},
	create: function() {
		var inputStyle = 'box-sizing: border-box; width: 200px; height: 40px; padding: 4px 12px; border: 1px solid #000; background-color: #4af; position: fixed; font: 24px ' + this.game.theme.font;
		
		this.sprite = this.game.add.sprite(this.game.world.centerX, 180, 'math-maze-logo');
		this.sprite.anchor.setTo(0.5, 0.5);

		this.titleLabel = this.game.add.text(this.game.world.centerX, 360, 'Gamejolt Login', { font: '64px ' + this.game.theme.font, fill: '#ffffff', align: 'center'});
		this.titleLabel.anchor.setTo(0.5, 0.5);
		
		this.usernameLabel = this.game.add.text(this.game.world.centerX - 5, 405, 'Username', { font: '28px ' + this.game.theme.font, fill: '#ffffff', align: 'center'});
		this.usernameLabel.anchor.setTo(1, 0);

		this.usernameInput = document.createElement('input');
		this.usernameInput.value = ServiceApi.user !== null ? ServiceApi.user.username : '';
		this.usernameInput.style.cssText = 'left: 405px; top: 400px;' + inputStyle;
		document.body.appendChild(this.usernameInput);
		
		this.tokenLabel = this.game.add.text(this.game.world.centerX - 5, 455, 'Token', { font: '28px ' + this.game.theme.font, fill: '#ffffff', align: 'center'});
		this.tokenLabel.anchor.setTo(1, 0);
		
		this.tokenInput = document.createElement('input');
		this.tokenInput.value = ServiceApi.user !== null ? ServiceApi.user.token : '';
		this.tokenInput.style.cssText = 'left: 405px; top: 450px;' + inputStyle;
		document.body.appendChild(this.tokenInput);
		
		this.loginButton = new LabelButton(this.game, this.world.centerX - 5, 500, 'btn', 'Login', _.bind(this.login, this), this, this);
		this.loginButton.anchor.setTo(1, 0);
		this.loginButton.width = 200;	
		this.loginButton.height = 40;
		this.loginButton.label.setStyle({ font: '24px ' + this.game.theme.font, fill: '#000000', align: 'center' }, true);
		
		this.game.world.add(this.loginButton);
		
		this.cancelButton = new LabelButton(this.game, this.world.centerX + 5, 500, 'btn', 'Cancel', _.bind(this.cancel, this), this, this);
		this.cancelButton.anchor.setTo(0, 0);
		this.cancelButton.width = 200;	
		this.cancelButton.height = 40;
		this.cancelButton.label.setStyle({ font: '24px ' + this.game.theme.font, fill: '#000000', align: 'center' }, true);
		
		this.game.world.add(this.cancelButton);
	},
	login: function() {
		console.log('on login ');
		this.game.user = ServiceApi.user;
	},
	cancel: function() {
		console.log('on cancel ');
		this.game.state.start('menu');
	},
	onData: function(response) {
		console.log('on data ', response, ServiceApi.user);
		if (ServiceApi.user !== null) {
			if (!ServiceApi.user.guest) {
				this.game.state.start('menu');
			}
		}
	},
	onError: function(response) {
		console.log('on error ', response);
	},
	shutdown: function() {
		document.body.removeChild(this.usernameInput);
		delete this.usernameInput;
		
		document.body.removeChild(this.tokenInput);
		delete this.tokenInput;
	}
};

module.exports = GamejoltSetupState;