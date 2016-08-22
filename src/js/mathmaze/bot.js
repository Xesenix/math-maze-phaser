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
	traverse: function (distance, movesCoded, board) {
		var moves = _.split(movesCoded, ',');
		var position = {
			x: 0,
			y: 0
		};
		var result = {
			steps: 0,
			realSteps: 0,
			value: board.getValue(position.x, position.y),
			position: _.clone(position)
		};

		for (var i = 0; i < distance; i++) {
			var code = moves[i % moves.length];
			var move = this.decodedMove[code];
			position.x += move.x;
			position.y += move.y;
			result.value = move.action(result, board.getValue(position.x, position.y), position.x, position.y);
		}

		return result;
	}
};

module.exports = Bot;