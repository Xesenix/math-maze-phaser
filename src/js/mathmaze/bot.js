var _ = require('lodash');

var Bot = function (vertical, horizontal) {
	this.decodedMove = {
		L: {
			x: -1,
			y: 0,
			action: horizontal
		},
		P: {
			x: 1,
			y: 0,
			action: horizontal
		},
		G: {
			x: 0,
			y: -1,
			action: vertical
		},
		D: {
			x: 0,
			y: 1,
			action: vertical
		}
	};
};

Bot.prototype = {
	traverse: function (movesCoded, board) {
		var moves = _.split(movesCoded, ',');
		var position = {
			x: 0,
			y: 0
		};
		var result = {
			value: board.getValue(position.x, position.y),
			position: position
		};

		_.each(moves, _.bind(function (code) {
			var move = this.decodedMove[code];
			result.position.x += move.x;
			result.position.y += move.y;
			result.value = move.action(result, board.getValue(result.position.x, result.position.y));
		}, this));

		return result;
	}
};

module.exports = Bot;