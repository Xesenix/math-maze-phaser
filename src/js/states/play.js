'use strict';
/* global Phaser */
var _ = require('lodash');

var difficulty = {
	maxNumber: 3, // 2-9
	sizeX: 4,
	sizeY: 3,
	vertical: function (result, nodeValue) {
		return result.value * nodeValue;
	},
	horizontal: function (result, nodeValue) {
		return result.value + nodeValue;
	},
	moves: [
		"P,D,L,G,P,P,D,D,P",
		"D,P,D,G,P,P,D,L,P",
		"D,D,P,P,G,L,G,P,P"
	]
};

var Board = require('./../components/board.js');
var Bot = require('./../mathmaze/bot.js');
var LabelButton = require('./../components/label_button.js');
//var UI = require('./../factory/ui.js');

function Play() {}

Play.prototype = {
	init: function(level) {
		console.log('Play', level);
		this.level = level || 1;
		
		this.levelConfig = _.extend({
			seed: this.level
		}, difficulty);
		
		this.tileBaseSize = 128;
		this.tileSize = 128;
		this.boardWidth = difficulty.sizeX * this.tileSize;
		this.offsetX = (this.world.width - this.boardWidth) / 2;
		this.offsetY = 120;

		this.position = {
			x: 0,
			y: 0
		};

		this.board = new Board(this.levelConfig);

		var bot = new Bot(this.levelConfig.vertical, this.levelConfig.horizontal);

		this.target = bot.traverse(this.levelConfig.moves[this.level % this.levelConfig.moves.length], this.board);
	},
	create: function () {
		this.setupKeyboard();
		this.createInterface();

		this.restartButton = new LabelButton(this.game, 140, this.world.height - 10, 'btn', 'Restart (R)', _.bind(this.reset, this), this);
		this.restartButton.anchor.setTo(0, 1);
		this.restartButton.width = 200;	
		this.restartButton.height = 60;
		this.restartButton.label.setStyle({ font: '32px VT323', fill: '#000000' }, true);
		this.game.world.add(this.restartButton);
		
		this.menuButton = new LabelButton(this.game, 10, this.world.height - 10, 'btn', 'Menu', _.bind(function() {this.game.state.start('menu');}, this), this);
		this.menuButton.anchor.setTo(0, 1);
		this.menuButton.width = 120;	
		this.menuButton.height = 60;
		this.menuButton.label.setStyle({ font: '32px VT323', fill: '#000000' }, true);
		this.game.world.add(this.menuButton);
		
		//this.pointer = this.game.add.sprite(this.offsetX + this.position.x * tileSize - 32, this.offsetY + this.position.y * tileSize - 32, 'pointer');
		//this.pointer.scale.setTo(192 / 256 * scale, 192 / 256 * scale);
		this.reset();
	},
	setupKeyboard: function() {
		this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.resetKey.onDown.add(_.bind(this.reset, this));

		this.game.input.keyboard.onUpCallback = _.bind(this.onKeyboard, this);
	},
	createBoard: function() {
		var x, y, tile, node, scale = this.tileSize / this.tileBaseSize;
		
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

				tile = this.game.add.sprite(x * this.tileSize, y * this.tileSize, 'tile-' + node.value);
				tile.scale.setTo(scale, scale);
				tile.inputEnabled = true;
				tile.events.onInputDown.add(_.bind(this.moveTo, this, x, y));
				
				node.tile = tile;
				this.node[x][y] = node;
				
				this.boardGroup.add(tile);
			}
		}
	},
	createBackground: function() {
		this.background = this.game.add.graphics(0, 0);
		this.background.beginFill(0x0a2d40);
		this.background.drawRect(30, 80, this.game.world.width - 60, this.game.world.height - 80);
		this.background.endFill();
		this.background.beginFill(0x0c3953);
		this.background.drawRect(60, 80, this.game.world.width - 120, this.game.world.height - 80);
		this.background.endFill();
		this.background.beginFill(0x03996d);
		this.background.drawRect(0, 0, this.game.world.width, 80);
		this.background.endFill();
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
		var width = 16;
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
	},
	createInterface: function() {
		var headerStyle = {
			font: '64px VT323',
			fill: '#ffffff',
			align: 'center'
		};
		var style = {
			font: '32px VT323',
			fill: '#ffffff',
			align: 'right'
		};
		
		this.createBackground();
		this.createBoard();
		this.createPointer();

		this.levelLabel = this.game.add.text(this.game.world.centerX, 40, 'Level', headerStyle);
		this.levelLabel.anchor.setTo(0.5, 0.5);
		this.levelLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		this.resultLabel = this.game.add.text(10, 40, 'Result', style);
		this.resultLabel.anchor.setTo(0, 0.5);
		this.resultLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		
		this.targetLabel = this.game.add.text(this.game.world.width - 10, 40, 'Target: ', style);
		this.targetLabel.anchor.setTo(1, 0.5);
		this.targetLabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

		//this.infoLabel = this.game.add.text(this.game.world.width - 10, this.game.world.height, 'Press R to restart', style);
		//this.infoLabel.anchor.setTo(1, 1);
	},
	reset: function () {
		this.position = {
			x: 0,
			y: 0
		};
		this.enabled = true;
		this.result = this.node[this.position.x][this.position.y].value;
		
		this.targetLabel.text = 'Target: ' + this.target.value;
		this.levelLabel.text = 'Level: ' + this.level;
		
		this.updateView();
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

			if (this.position.x + change.x < 0 || this.position.x + change.x > difficulty.sizeX - 1) {
				change.x = 0;
			}

			if (this.position.y + change.y < 0 || this.position.y + change.y > difficulty.sizeY - 1) {
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
		for (x = 0; x < difficulty.sizeX; x++) {
			for (y = 0; y < difficulty.sizeY; y++) {
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

		this.resultLabel.text = 'Result: ' + this.result;
		
		this.redrawPointer();
	},
	moveTo: function (x, y) {
		var change = {
			x: this.position.x - x,
			y: this.position.y - y
		};

		if (this.board.distance(x, y, this.position.x, this.position.y) === 1) {
			this.position.x = x;
			this.position.y = y;

			if (change.x !== 0) {
				this.result += this.node[this.position.x][this.position.y].value;
			} else if (change.y !== 0) {
				this.result *= this.node[this.position.x][this.position.y].value;
			}

			if (this.target.value === this.result) {
				// win
				this.game.state.start('finish', true, false, this.level, { value: this.result, position: this.position }, this.target);
			} else if (this.target.value < this.result) {
				// lose
				this.game.state.start('finish', true, false, this.level, { value: this.result, position: this.position }, this.target);
			} else {
				this.updateView();
			}
		}
	}
};

module.exports = Play;