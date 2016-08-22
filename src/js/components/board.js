'use strict';
var RandGenerator = require('random-seed');

var Board = function (level) {
	this.create(level);
};

Board.prototype = {
	create: function (config) {
		var x, y, node;
		var rand = new RandGenerator(config.level);
		
		this.node = [];

		for (x = 0; x < config.sizeX; x++) {
			this.node[x] = [];
			for (y = 0; y < config.sizeY; y++) {
				node = {
					value: rand.intBetween(1, config.maxNumber)
				};
				this.node[x][y] = node;
			}
		}
	},
	distance: function (ax, ay, bx, by) {
		return Math.abs(ax - bx) + Math.abs(ay - by);
	},
	getValue: function (x, y) {
		return this.node[x][y].value;
	}
};

module.exports = Board;