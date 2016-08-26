'use strict';
/* global Phaser */
var _ = require('lodash');
var Board = require('../components/board.js');
var Bot = require('../mathmaze/bot.js');
var LabelButton = require('../components/label_button.js');
var Localize = require('localize');
var localization = new Localize({
    'Easy level: $[1]': {
        pl: 'Poziom łatwy: $[1]'
    },
    'Medium level: $[1]': {
        pl: 'Poziom średni: $[1]'
    },
    'Hard level: $[1]': {
        pl: 'Poziom trudny: $[1]'
    },
    'Insane level: $[1]': {
        pl: 'Poziom szalony: $[1]'
    },
	'Total score: $[1]': {
		pl: 'Suma punktów: $[1]'
	},
	'Current value: $[1]': {
		pl: 'Obecna wartość: $[1]'
	},
	'Target value: $[1]': {
		pl: 'Oczekiwana wartość: $[1]'
	},
	'Steps: $[1]': {
		pl: 'Wykonanych kroków: $[1]'	
	},
	'Steps for bonus: $[1] or less': {
		pl: 'Kroki do bonusu: $[1] lub mniej'
	},
	'Restart (R)': {
		pl: 'Restartuj (R)'
	},
	'Menu (ESC)': {
		pl: 'Menu (ESC)'
	},
	'Help (H)': {
		pl: 'Pomoc (H)'
	}
});

function Play() {}

Play.prototype = {
	tutorialIndex: -1,
	tutorialStep: [
		'Your goal is to make current value equal to target value.\n',
		'Use eighter arrows, a/s/d/w or mouse to change you position.',
		'When you move horizontal (left/right)\nyou add value in squere you moved to your current collected value.',
		'When you move vertical (top/down)\n you multiply your current collected value by amount in tile you moved to.',
		'You get points x2 bonus for finishing in less then required amount of steps.',
		'You can get additional x2 bonus for finishing on blue squere.\nIt works only if blue squer is your last step!'
	],
	init: function(level, difficulty) {
		// game state setup
		this.level = level || 1;
		this.difficulty = difficulty;
		this.levelConfig = _.extend({
			level: this.level,
			steps: Math.floor(this.level / 3) + 3
		}, this.difficulty.config);
		this.position = {
			x: 0,
			y: 0
		};
		this.steps = 0;

		this.board = new Board(this.levelConfig);

		var bot = new Bot(this.levelConfig.vertical, this.levelConfig.horizontal);

		this.target = bot.traverse(
			this.levelConfig.steps,
			this.levelConfig.moves[this.level % this.levelConfig.moves.length],
			this.board
		);
		
		// display setup
		this.tileBaseSize = 128;
		this.tileSize = 112;
		this.boardWidth = this.levelConfig.sizeX * this.tileSize;
		this.offsetX = (this.world.width - this.boardWidth) / 2;
		this.offsetY = 140;
		
		localization.setLocale(this.game.lang || 'en');
	},
	reset: function () {
		this.position.x = 0;
		this.position.y = 0;
		this.steps = 0;
		this.enabled = true;
		this.result = this.node[this.position.x][this.position.y].value;
		
		this.stepsLabel.text = localization.translate('Steps: $[1]', this.steps);
		
		this.updateView();
	},
	create: function () {
		this.setupKeyboard();
		this.createInterface();
		
		//this.pointer = this.game.add.sprite(this.offsetX + this.position.x * tileSize - 32, this.offsetY + this.position.y * tileSize - 32, 'pointer');
		//this.pointer.scale.setTo(192 / 256 * scale, 192 / 256 * scale);
		this.reset();
	},
	setupKeyboard: function() {
		this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.resetKey.onDown.add(_.bind(this.reset, this));
		
		this.helpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
		this.helpKey.onDown.add(_.bind(this.tutorial, this));
		
		this.menuKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		this.menuKey.onDown.add(_.bind(this.menu, this));

		this.game.input.keyboard.onUpCallback = _.bind(this.onKeyboard, this);
	},
	createBoard: function() {
		var x, y, tile, node;//, scale = this.tileSize / this.tileBaseSize;
		
		this.node = [];
		this.boardGroup = this.game.add.group();
		this.boardGroup.x = this.offsetX;
		this.boardGroup.y = this.offsetY;

		for (x = 0; x < this.levelConfig.sizeX; x++) {
			this.node[x] = [];
			for (y = 0; y < this.levelConfig.sizeY; y++) {
				node = {
					value: this.board.getValue(x, y)
				};

				tile = new LabelButton(
					this.game,
					x * this.tileSize,
					y * this.tileSize,
					'btn', node.value,
					_.bind(this.moveTo, this, x, y)
				);
				tile.width = this.tileSize;
				tile.height = this.tileSize;
				tile.label.setStyle({ font: '64px ' + this.game.theme.font, fill: '#444444' }, true);
				
				node.tile = tile;
				this.node[x][y] = node;
				
				this.boardGroup.add(tile);
				
				this.game.add.tween(tile)
					.from({ x: x * this.tileSize + 100, alpha: 0 }, 400, Phaser.Easing.Linear.NONE, true, (x * this.levelConfig.sizeY + y) * 50, 0, false);
			}
		}
	},
	createBackground: function() {
		this.background = this.game.add.graphics(0, 0);
		this.background.beginFill(0x0a2d40);
		this.background.drawRect(30, 0, this.game.world.width - 60, this.game.world.height);
		this.background.endFill();
		this.background.beginFill(0x0c3953);
		this.background.drawRect(60, 0, this.game.world.width - 120, this.game.world.height);
		this.background.endFill();
		
		//this.game.add.tween(this.background).from({ y: this.game.world.height, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
		
		this.subbar = this.game.add.graphics(0, 0);
		this.subbar.beginFill(0x008050);
		this.subbar.drawRect(0, 40, this.game.world.width, 80);
		this.subbar.endFill();
		
		this.topbar = this.game.add.graphics(0, 0);
		this.topbar.beginFill(0x006030);
		this.topbar.drawRect(0, -40, this.game.world.width, 80);
		this.topbar.endFill();
		
		this.game.add.tween(this.topbar)
			.from({ y: this.topbar.y + 40 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
	},
	draw: {
		plus: function(graphics, x, y, size) {
    		graphics.lineStyle(8, 0x000000);
			graphics.moveTo(x + size, y);
			graphics.lineTo(x - size, y);
			graphics.moveTo(x, y - size);
			graphics.lineTo(x, y + size);
		},
		multiply: function(graphics, x, y, size) {
    		graphics.lineStyle(8, 0x000000);
			graphics.moveTo(x - 0.7 * size, y - 0.7 * size);
			graphics.lineTo(x + 0.7 * size, y + 0.7 * size);
			graphics.moveTo(x + 0.7 * size, y - 0.7 * size);
			graphics.lineTo(x - 0.7 * size, y + 0.7 * size);
		}
	},
	redrawPointer: function() {
		this.pointer.clear();
		
		if (this.position.x < this.levelConfig.sizeX - 1) {
			this.draw.plus(this.pointer, this.tileSize, this.tileSize / 2, 16);
		}
		
		if (this.position.x > 0) {
			this.draw.plus(this.pointer, 0, this.tileSize / 2, 16);
		}
		
		if (this.position.y < this.levelConfig.sizeY - 1) {
			this.draw.multiply(this.pointer, this.tileSize / 2, this.tileSize, 16);
		}
		
		if (this.position.y > 0) {
			this.draw.multiply(this.pointer, this.tileSize / 2, 0, 16);
		}
	},
	createPointer: function() {
		this.pointer = this.game.add.graphics(0, 0);
		this.redrawPointer();
		this.game.add.tween(this.pointer)
			.from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, this.levelConfig.sizeX * this.levelConfig.sizeY * 100, 0, false);
	},
	createInterface: function() {
		this.createBackground();
		this.createBoard();
		this.createPointer();

		this.levelLabel = this.game.add.text(
			20,
			10,
			localization.translate(this.levelConfig.label + ' level: $[1]', this.level),
			{ font: '24px ' + this.game.theme.font, fill: '#ffffff' }
		);
		this.levelLabel.anchor.setTo(0, 0);
		//this.levelLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		this.scoreLabel = this.game.add.text(
			this.game.world.width - 20,
			10,
			localization.translate('Total score: $[1]', _.sum(_.map(this.game.mode, 'points'))),
			{ font: '24px ' + this.game.theme.font, fill: '#ffffff' }
		);
		this.scoreLabel.anchor.setTo(1, 0);
		//this.scoreLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		this.resultLabel = this.game.add.text(
			20,
			85,
			localization.translate('Current value: $[1]', 0),
			{ font: '28px ' + this.game.theme.font, fill: '#ffffff' }
		);
		this.resultLabel.anchor.setTo(0, 1);
		this.resultLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		this.stepsLabel = this.game.add.text(
			20,
			105,
			localization.translate('Steps: $[1]', 0),
			{ font: '20px ' + this.game.theme.font, fill: '#ffffff' }
		);
		this.stepsLabel.anchor.setTo(0, 0.5);
		this.stepsLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
		this.targetLabel = this.game.add.text(
			this.game.world.width - 20,
			85,
			localization.translate('Target value: $[1]', this.target.value),
			{ font: '28px ' + this.game.theme.font, fill: '#ffffff' }
		);
		this.targetLabel.anchor.setTo(1, 1);
		this.targetLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
		this.bonusStepsLabel = this.game.add.text(
			this.game.world.width - 20,
			105,
			localization.translate('Steps for bonus: $[1] or less', this.target.steps),
			{ font: '20px ' + this.game.theme.font, fill: '#ffffff' }
		);
		this.bonusStepsLabel.anchor.setTo(1, 0.5);
		this.bonusStepsLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
		this.restartButton = new LabelButton(
			this.game,
			this.world.centerX - 110,
			this.world.height - 10,
			'btn',
			localization.translate('Restart (R)'),
			_.bind(this.reset, this)
		);
		this.restartButton.anchor.setTo(1, 1);
		this.restartButton.width = 200;	
		this.restartButton.height = 60;
		this.restartButton.tint = 0xffbb60;
		this.restartButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
		this.game.world.add(this.restartButton);
		
		this.helpButton = new LabelButton(
			this.game,
			this.world.centerX,
			this.world.height - 10,
			'btn', 
			localization.translate('Help (H)'),
			_.bind(this.tutorial, this)
		);
		this.helpButton.anchor.setTo(0.5, 1);
		this.helpButton.width = 200;	
		this.helpButton.height = 60;
		this.helpButton.tint = 0xffbb60;
		this.helpButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
		this.game.world.add(this.helpButton);
		
		this.menuButton = new LabelButton(
			this.game,
			this.world.centerX + 110,
			this.world.height - 10,
			'btn', 
			localization.translate('Menu (ESC)'),
			_.bind(this.menu, this)
		);
		this.menuButton.anchor.setTo(0, 1);
		this.menuButton.width = 200;	
		this.menuButton.height = 60;
		this.menuButton.tint = 0xffbb60;
		this.menuButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
		this.game.world.add(this.menuButton);
		
		this.game.add.tween(this.levelLabel)
			.from({ x: this.levelLabel.x - 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		this.game.add.tween(this.resultLabel)
			.from({ x: this.resultLabel.x - 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		this.game.add.tween(this.stepsLabel)
			.from({ x: this.stepsLabel.x - 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		
		this.game.add.tween(this.scoreLabel)
			.from({ x: this.scoreLabel.x + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		this.game.add.tween(this.targetLabel)
			.from({ x: this.targetLabel.x + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		this.game.add.tween(this.bonusStepsLabel)
			.from({ x: this.bonusStepsLabel.x + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		
		this.game.add.tween(this.menuButton)
			.from({ y: this.menuButton.y + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		this.game.add.tween(this.helpButton)
			.from({ y: this.helpButton.y + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
		this.game.add.tween(this.restartButton)
			.from({ y: this.restartButton.y + 100, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);

		//this.infoLabel = this.game.add.text(this.game.world.width - 10, this.game.world.height, 'Press R to restart', style);
		//this.infoLabel.anchor.setTo(1, 1);
	},
	update: function () {
		/*if (this.game.input.activePointer.withinGame) {
			this.game.input.enabled = true;
			this.game.stage.backgroundColor = '#000';
		} else {
			this.game.input.enabled = false;
			this.game.stage.backgroundColor = '#ddd';
		}*/

		var keyboard = this.game.input.keyboard;
		var change = {
			x: 0,
			y: 0
		};

		if (this.enabled) {
			if (keyboard.isDown(Phaser.Keyboard.LEFT) || keyboard.isDown(Phaser.Keyboard.A)) {
				change.x -= 1;
			} else if (keyboard.isDown(Phaser.Keyboard.RIGHT) || keyboard.isDown(Phaser.Keyboard.D)) {
				change.x += 1;
			} else if (keyboard.isDown(Phaser.Keyboard.UP) || keyboard.isDown(Phaser.Keyboard.W)) {
				change.y -= 1;
			} else if (keyboard.isDown(Phaser.Keyboard.DOWN) || keyboard.isDown(Phaser.Keyboard.S)) {
				change.y += 1;
			}

			if (this.position.x + change.x < 0 || this.position.x + change.x > this.levelConfig.sizeX - 1) {
				change.x = 0;
			}

			if (this.position.y + change.y < 0 || this.position.y + change.y > this.levelConfig.sizeY - 1) {
				change.y = 0;
			}

			if (change.x !== 0 || change.y !== 0) {
				this.enabled = false;

				this.moveTo(this.position.x + change.x, this.position.y + change.y);
			}
		}
	},
	onKeyboard: function () {
		this.enabled = true;
	},
	updateView: function () {
		var x, y, node, distance;
		for (x = 0; x < this.levelConfig.sizeX; x++) {
			for (y = 0; y < this.levelConfig.sizeY; y++) {
				node = this.node[x][y];
				distance = this.board.distance(x, y, this.position.x, this.position.y);
				if (x === this.target.position.x && y === this.target.position.y) {
					node.tile.tint = 0x8888ff;
				} else if (distance === 1) {
					node.tile.tint = 0xffffff;
				} else if (distance === 0) {
					node.tile.tint = 0xaaffaa;
				} else {
					node.tile.tint = 0xaaaaaa;
				}

				if (distance === 1) {
					node.tile.input.useHandCursor = true;
				} else {
					node.tile.input.useHandCursor = false;
				}
			}
		}

		this.pointer.position.setTo(this.offsetX + this.position.x * this.tileSize, this.offsetY + this.position.y * this.tileSize);

		this.resultLabel.text = localization.translate('Current value: $[1]', this.result);
		this.stepsLabel.text = localization.translate('Steps: $[1]', this.steps);
		
		this.redrawPointer();
	},
	menu: function() {
		this.game.state.start('menu');
	},
	createTutorial: function() {
		console.log('createTutorial', this.tutorialIndex);
		if (this.tutorialIndex === -1) {
			this.tutorialIndex = 0;
			this.tutorialGroup = this.game.add.group();
			
			var background = this.game.add.graphics(0, 0);
			background.beginFill(0x006030);
			background.drawRect(0, 0, this.game.world.width, 160);
			background.endFill();
			
			this.tutorialLabel = this.game.add.text(
				this.game.world.centerX,
				20,
				this.tutorialStep[this.tutorialIndex],
				{ font: '20px ' + this.game.theme.font, fill: '#ffffff', align: 'center' }
			);
			this.tutorialLabel.anchor.setTo(0.5, 0);
			
			this.helpNextButton = new LabelButton(
				this.game,
				this.world.centerX + 105,
				150,
				'btn', 
				localization.translate('Next'),
				_.bind(this.tutorialStepChange, this, 1)
			);
			this.helpNextButton.anchor.setTo(0, 1);
			this.helpNextButton.width = 200;	
			this.helpNextButton.height = 60;
			this.helpNextButton.tint = 0xffbb60;
			this.helpNextButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
			
			this.helpBackButton = new LabelButton(
				this.game,
				this.world.centerX,
				150,
				'btn', 
				localization.translate('Back'),
				_.bind(this.tutorial, this, -1)
			);
			this.helpBackButton.anchor.setTo(0.5, 1);
			this.helpBackButton.width = 200;	
			this.helpBackButton.height = 60;
			this.helpBackButton.tint = 0xffbb60;
			this.helpBackButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
			
			this.helpPrevButton = new LabelButton(
				this.game,
				this.world.centerX - 105,
				150,
				'btn', 
				localization.translate('Previous'),
				_.bind(this.tutorialStepChange, this, -1)
			);
			this.helpPrevButton.anchor.setTo(1, 1);
			this.helpPrevButton.width = 200;	
			this.helpPrevButton.height = 60;
			this.helpPrevButton.tint = 0xffbb60;
			this.helpPrevButton.label.setStyle({ font: '28px ' + this.game.theme.font, fill: '#000000' }, true);
			
			this.tutorialGroup.add(background);
			this.tutorialGroup.add(this.tutorialLabel);
			this.tutorialGroup.add(this.helpNextButton);
			this.tutorialGroup.add(this.helpBackButton);
			this.tutorialGroup.add(this.helpPrevButton);
			this.tutorialGroup.y = this.world.height - 160;
			
			this.game.add.tween(background)
				.from({ x: -this.game.world.width, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
			this.game.add.tween(this.tutorialLabel)
				.from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
			this.game.add.tween(this.helpNextButton)
				.from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
			this.game.add.tween(this.helpBackButton)
				.from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
			this.game.add.tween(this.helpPrevButton)
				.from({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 500, 0, false);
			
			this.tutorialStepChange(0);
		} else {
			this.tutorialClose();
		}
	},
	tutorialClose: function() {
		this.tutorialIndex = -1;
		this.tutorialStepChange(0);
		
		if (typeof(this.tutorialGroup) !== 'undefined' && this.tutorialGroup != null) {
			this.tutorialGroup.destroy();
		}
		
		this.tutorialLabel = null;
		this.helpNextButton = null;
		this.helpPrevButton = null;
		this.tutorialGroup = null;
	},
	tutorial: function() {
		this.createTutorial();
		//this.tutorialGroup
	},
	tutorialStepChange: function(change) {
		if (this.tutorialIndex + change >= 0 && this.tutorialIndex + change < this.tutorialStep.length) {
			this.tutorialIndex += change;
			this.tutorialLabel.text = this.tutorialStep[this.tutorialIndex];
		} else if (change !== 0) {
			return;
		}
		
		this.game.tweens.remove(this.levelLabelTween);
		this.game.tweens.remove(this.resultLabelTween);
		this.game.tweens.remove(this.stepsLabelTween);
		this.game.tweens.remove(this.scoreLabelTween);
		this.game.tweens.remove(this.targetLabelTween);
		this.game.tweens.remove(this.bonusStepsLabelTween);
		this.game.tweens.remove(this.targetTileTween);
		this.game.tweens.remove(this.leftTileTween);
		this.game.tweens.remove(this.rightTileTween);
		this.game.tweens.remove(this.topTileTween);
		this.game.tweens.remove(this.bottomTileTween);
		
		if (this.tutorialIndex === 0) {
			this.helpPrevButton.tint = 0xaaaaaa;
		} else {
			this.helpPrevButton.tint = 0xffbb60;
		}
		
		if (this.tutorialIndex === this.tutorialStep.length - 1) {
			this.helpNextButton.tint = 0xaaaaaa;
		} else {
			this.helpNextButton.tint = 0xffbb60;
		}
		
		var targetTile = this.node[this.target.position.x][this.target.position.y].tile;
		
		var leftTile = this.position.x > 0 ? this.node[this.position.x - 1][this.position.y].tile : { y: 0 };
		var rightTile = this.position.x < this.levelConfig.sizeX - 1 ? this.node[this.position.x + 1][this.position.y].tile : { y: 0};
		
		var topTile = this.position.y > 0 ? this.node[this.position.x][this.position.y - 1].tile : { y: 0 };
		var bottomTile = this.position.y < this.levelConfig.sizeY - 1 ? this.node[this.position.x][this.position.y + 1].tile : { y: 0};
		
		this.levelLabel.x = 20;
		this.levelLabel.alpha = 1;
		
		this.resultLabel.x = 20;
		this.resultLabel.alpha = 1;
		
		this.stepsLabel.x = 20;
		this.stepsLabel.alpha = 1;
		
		this.scoreLabelx = this.game.world.width - 20;
		this.scoreLabelalpha = 1;
		
		this.targetLabel.x = this.game.world.width - 20;
		this.targetLabel.alpha = 1;
		
		this.bonusStepsLabel.x = this.game.world.width - 20;
		this.bonusStepsLabel.alpha = 1;

		targetTile.y = this.target.position.y * this.tileSize;
		
		leftTile.y = this.position.y * this.tileSize;
		rightTile.y = this.position.y * this.tileSize;
		topTile.y = (this.position.y - 1) * this.tileSize;
		bottomTile.y = (this.position.y + 1) * this.tileSize;
		
		switch (this.tutorialIndex) {
			case 0:
				this.levelLabelTween = this.game.add.tween(this.levelLabel)
					.to({ x: -80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.resultLabelTween = this.game.add.tween(this.resultLabel)
					.to({ x: 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.stepsLabelTween = this.game.add.tween(this.stepsLabel)
					.to({ x: -80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);

				this.scoreLabelTween = this.game.add.tween(this.scoreLabel)
					.to({ x: this.game.world.width + 80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.targetLabelTween = this.game.add.tween(this.targetLabel)
					.to({ x: this.game.world.width - 10 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.bonusStepsLabelTween = this.game.add.tween(this.bonusStepsLabel)
					.to({ x: this.game.world.width + 80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.targetTileTween = this.game.add.tween(targetTile)
					.to({ y: this.target.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.leftTileTween = this.game.add.tween(leftTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.rightTileTween = this.game.add.tween(rightTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.topTileTween = this.game.add.tween(topTile)
					.to({ y: (this.position.y - 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bottomTileTween = this.game.add.tween(bottomTile)
					.to({ y: (this.position.y + 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				break;
			case 1:
				this.levelLabelTween = this.game.add.tween(this.levelLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.resultLabelTween = this.game.add.tween(this.resultLabel)
					.to({ x: 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.stepsLabelTween = this.game.add.tween(this.stepsLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);

				this.scoreLabelTween = this.game.add.tween(this.scoreLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.targetLabelTween = this.game.add.tween(this.targetLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bonusStepsLabelTween = this.game.add.tween(this.bonusStepsLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.targetTileTween = this.game.add.tween(targetTile)
					.to({ y: this.target.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.leftTileTween = this.game.add.tween(leftTile)
					.to({ y: this.position.y * this.tileSize - 10 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.rightTileTween = this.game.add.tween(rightTile)
					.to({ y: this.position.y * this.tileSize - 10 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.topTileTween = this.game.add.tween(topTile)
					.to({ y: (this.position.y - 1) * this.tileSize - 10}, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.bottomTileTween = this.game.add.tween(bottomTile)
					.to({ y: (this.position.y + 1) * this.tileSize - 10}, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				break;
			case 2:
				this.levelLabelTween = this.game.add.tween(this.levelLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.resultLabelTween = this.game.add.tween(this.resultLabel)
					.to({ x: 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.stepsLabelTween = this.game.add.tween(this.stepsLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);

				this.scoreLabelTween = this.game.add.tween(this.scoreLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.targetLabelTween = this.game.add.tween(this.targetLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bonusStepsLabelTween = this.game.add.tween(this.bonusStepsLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.targetTileTween = this.game.add.tween(targetTile)
					.to({ y: this.target.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.leftTileTween = this.game.add.tween(leftTile)
					.to({ y: this.position.y * this.tileSize - 10 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.rightTileTween = this.game.add.tween(rightTile)
					.to({ y: this.position.y * this.tileSize - 10 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.topTileTween = this.game.add.tween(topTile)
					.to({ y: (this.position.y - 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bottomTileTween = this.game.add.tween(bottomTile)
					.to({ y: (this.position.y + 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				break;
			case 3:
				this.levelLabelTween = this.game.add.tween(this.levelLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.resultLabelTween = this.game.add.tween(this.resultLabel)
					.to({ x: 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.stepsLabelTween = this.game.add.tween(this.stepsLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);

				this.scoreLabelTween = this.game.add.tween(this.scoreLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.targetLabelTween = this.game.add.tween(this.targetLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bonusStepsLabelTween = this.game.add.tween(this.bonusStepsLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.targetTileTween = this.game.add.tween(targetTile)
					.to({ y: this.target.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.leftTileTween = this.game.add.tween(leftTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.rightTileTween = this.game.add.tween(rightTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.topTileTween = this.game.add.tween(topTile)
					.to({ y: (this.position.y - 1) * this.tileSize - 10}, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.bottomTileTween = this.game.add.tween(bottomTile)
					.to({ y: (this.position.y + 1) * this.tileSize - 10}, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				break;
			case 4:
				this.levelLabelTween = this.game.add.tween(this.levelLabel)
					.to({ x: -80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.resultLabelTween = this.game.add.tween(this.resultLabel)
					.to({ x: -80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.stepsLabelTween = this.game.add.tween(this.stepsLabel)
					.to({ x: 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);

				this.scoreLabelTween = this.game.add.tween(this.scoreLabel)
					.to({ x: this.game.world.width - 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.targetLabelTween = this.game.add.tween(this.targetLabel)
					.to({ x: this.game.world.width + 80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bonusStepsLabelTween = this.game.add.tween(this.bonusStepsLabel)
					.to({ x: this.game.world.width - 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				
				this.targetTileTween = this.game.add.tween(targetTile)
					.to({ y: this.target.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.leftTileTween = this.game.add.tween(leftTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.rightTileTween = this.game.add.tween(rightTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.topTileTween = this.game.add.tween(topTile)
					.to({ y: (this.position.y - 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bottomTileTween = this.game.add.tween(bottomTile)
					.to({ y: (this.position.y + 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				break;
			case 5:
				this.levelLabelTween = this.game.add.tween(this.levelLabel)
					.to({ x: -80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.resultLabelTween = this.game.add.tween(this.resultLabel)
					.to({ x: -80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.stepsLabelTween = this.game.add.tween(this.stepsLabel)
					.to({ x: 20, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);

				this.scoreLabelTween = this.game.add.tween(this.scoreLabel)
					.to({ x: this.game.world.width - 10, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				this.targetLabelTween = this.game.add.tween(this.targetLabel)
					.to({ x: this.game.world.width + 80, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bonusStepsLabelTween = this.game.add.tween(this.bonusStepsLabel)
					.to({ x: this.game.world.width - 20, alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.targetTileTween = this.game.add.tween(targetTile)
					.to({ y: this.target.position.y * this.tileSize - 10 }, 500, Phaser.Easing.Linear.NONE, true, 0, 50, true);
				
				this.leftTileTween = this.game.add.tween(leftTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.rightTileTween = this.game.add.tween(rightTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.topTileTween = this.game.add.tween(topTile)
					.to({ y: (this.position.y - 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bottomTileTween = this.game.add.tween(bottomTile)
					.to({ y: (this.position.y + 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				break;
			default:
				this.levelLabelTween = this.game.add.tween(this.levelLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.resultLabelTween = this.game.add.tween(this.resultLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.stepsLabelTween = this.game.add.tween(this.stepsLabel)
					.to({ x: 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);

				this.scoreLabelTween = this.game.add.tween(this.scoreLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.targetLabelTween = this.game.add.tween(this.targetLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bonusStepsLabelTween = this.game.add.tween(this.bonusStepsLabel)
					.to({ x: this.game.world.width - 20, alpha: 1 }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.targetTileTween = this.game.add.tween(targetTile)
					.to({ y: this.target.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				
				this.leftTileTween = this.game.add.tween(leftTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.rightTileTween = this.game.add.tween(rightTile)
					.to({ y: this.position.y * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.topTileTween = this.game.add.tween(topTile)
					.to({ y: (this.position.y - 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				this.bottomTileTween = this.game.add.tween(bottomTile)
					.to({ y: (this.position.y + 1) * this.tileSize }, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
				break;
		}
	},
	moveTo: function (x, y) {
		if (this.tutorialIndex === -1) {
			var change = {
				x: this.position.x - x,
				y: this.position.y - y
			};

			if (this.board.distance(x, y, this.position.x, this.position.y) === 1) {
				this.position.x = x;
				this.position.y = y;
				this.steps++;

				if (change.x !== 0) {
					this.result += this.node[this.position.x][this.position.y].value;
				} else if (change.y !== 0) {
					this.result *= this.node[this.position.x][this.position.y].value;
				}

				if (this.target.value === this.result) {
					// win
					this.game.state.start('finish', true, false, this.level, { value: this.result, position: this.position, steps: this.steps }, this.target, this.difficulty);
				} else if (this.target.value < this.result) {
					// lose
					this.game.state.start('finish', true, false, this.level, { value: this.result, position: this.position, steps: this.steps }, this.target, this.difficulty);
				} else {
					this.updateView();
				}
			}
		}
	}
};

module.exports = Play;