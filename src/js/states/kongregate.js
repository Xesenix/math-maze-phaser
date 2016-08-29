'use strict';
var _ = require('lodash');
var LabelButton = require('../components/label_button.js');
var md5 = require('js-md5');

function KongregateSetupState() {}

KongregateSetupState.prototype = {
	init: function() {
		this.game.service.getUserData('gameSave')
			.then(_.bind(this.onData, this))
			.catch(_.bind(this.onError, this));
	},
	preload: function() {
	},
	create: function() {
		this.sprite = this.game.add.sprite(this.game.world.centerX, 180, 'math-maze-logo');
		this.sprite.anchor.setTo(0.5, 0.5);
		
		//this.asset = this.add.sprite(this.game.world.centerX, 450, 'preloader');
		//this.asset.width = 600;
		//this.asset.height = 20;
		//this.asset.anchor.setTo(0.5, 0.5);

		this.titleLabel = this.game.add.text(this.game.world.centerX, 360, 'Kongregate Login', { font: '64px ' + this.game.theme.font, fill: '#ffffff', align: 'center'});
		this.titleLabel.anchor.setTo(0.5, 0.5);

		this.infoLabel = this.game.add.text(this.game.world.centerX, 450, 'Please log in to Kongregate,\nif you wish your score would be\nsubmited to Kongregate leadboards.', { font: '20px ' + this.game.theme.font, fill: '#ffffff', align: 'center'});
		this.infoLabel.anchor.setTo(0.5, 0.5);

		this.loginButton = new LabelButton(this.game, this.world.centerX - 5, 500, 'btn', 'Login to Kongregate', _.bind(this.login, this), this, this);
		this.loginButton.anchor.setTo(1, 0);
		this.loginButton.width = 320;	
		this.loginButton.height = 60;
		this.loginButton.label.setStyle({ font: '24px ' + this.game.theme.font, fill: '#000000', align: 'center' }, true);
		
		this.game.world.add(this.loginButton);
		
		this.cancelButton = new LabelButton(this.game, this.world.centerX + 5, 500, 'btn', 'Continue as Guest', _.bind(this.cancel, this), this, this);
		this.cancelButton.anchor.setTo(0, 0);
		this.cancelButton.width = 320;	
		this.cancelButton.height = 60;
		this.cancelButton.label.setStyle({ font: '24px ' + this.game.theme.font, fill: '#000000', align: 'center' }, true);
		
		this.game.world.add(this.cancelButton);
	},
	login: function() {
		this.game.service.authenticate().then(_.bind(this.onData, this));
	},
	cancel: function() {
		this.game.service.setScores({
			'EasyLevel': this.game.mode.easy.unlocked,
			'MediumLevel': this.game.mode.medium.unlocked,
			'HardLevel': this.game.mode.hard.unlocked,
			'InsaneLevel': this.game.mode.insane.unlocked,
			'TotalLevel': this.game.mode.easy.unlocked + this.game.mode.medium.unlocked + this.game.mode.hard.unlocked + this.game.mode.insane.unlocked,
			'EasyPoints': this.game.mode.easy.points,
			'MediumPoints': this.game.mode.medium.points,
			'HardPoints': this.game.mode.hard.points,
			'InsanePoints': this.game.mode.insane.points,
			'TotalPoints': this.game.mode.easy.points + this.game.mode.medium.points + this.game.mode.hard.points + this.game.mode.insane.points,
			'EasyPerfect': this.game.mode.easy.perfect,
			'MediumPerfect': this.game.mode.medium.perfect,
			'HardPerfect': this.game.mode.hard.perfect,
			'InsanePerfect': this.game.mode.insane.perfect,
			'TotalPerfect': this.game.mode.easy.perfect + this.game.mode.medium.perfect + this.game.mode.hard.perfect + this.game.mode.insane.perfect
		});
		
		this.game.state.start('menu', true, false);
	},
	onData: function(gameSave) {
		if (!this.game.service.user.guest) {
			gameSave = _.extend({
				hash: null,
				progress: {}
			}, gameSave);

			if (gameSave.hash !== md5(gameSave.progress)) {
				gameSave.progress = {};
			}

			this.game.mode = _.merge(this.game.mode, gameSave.progress);
			
			this.game.service.setScores({
				'EasyLevel': this.game.mode.easy.unlocked,
				'MediumLevel': this.game.mode.medium.unlocked,
				'HardLevel': this.game.mode.hard.unlocked,
				'InsaneLevel': this.game.mode.insane.unlocked,
				'TotalLevel': this.game.mode.easy.unlocked + this.game.mode.medium.unlocked + this.game.mode.hard.unlocked + this.game.mode.insane.unlocked,
				'EasyPoints': this.game.mode.easy.points,
				'MediumPoints': this.game.mode.medium.points,
				'HardPoints': this.game.mode.hard.points,
				'InsanePoints': this.game.mode.insane.points,
				'TotalPoints': this.game.mode.easy.points + this.game.mode.medium.points + this.game.mode.hard.points + this.game.mode.insane.points,
				'EasyPerfect': this.game.mode.easy.perfect,
				'MediumPerfect': this.game.mode.medium.perfect,
				'HardPerfect': this.game.mode.hard.perfect,
				'InsanePerfect': this.game.mode.insane.perfect,
				'TotalPerfect': this.game.mode.easy.perfect + this.game.mode.medium.perfect + this.game.mode.hard.perfect + this.game.mode.insane.perfect
			});
			this.game.state.start('menu', true, false);
		}
	},
	onError: function(response) {
		console.log('on error ', response);
	}
};

module.exports = KongregateSetupState;