'use strict';
var RandGenerator = require('random-seed');

var Board = function (level) {
	this.create(level);
};

Board.prototype = {
	create: function (level) {
		var x, y, node;
		var rand = new RandGenerator(level.seed);
		
		this.node = [];

		for (x = 0; x < level.sizeX; x++) {
			this.node[x] = [];
			for (y = 0; y < level.sizeY; y++) {
				node = {
					value: rand.intBetween(1, level.maxNumber)
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