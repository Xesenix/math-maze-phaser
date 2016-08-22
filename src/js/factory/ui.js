'use strict';

var UI = {
	buildButton: function(game, x, y, text, anchorX, anchorY) {
		anchorX = (anchorX || 0) * 180;
		anchorY = (anchorY || 0) * 60;
		
		var button = game.add.group();
		button.x = x;
		button.y = y;
		
		var background = game.add.graphics(- anchorX, - anchorY);
		background.beginFill(0x03996d);
		background.drawRect(0, 0, 180, 60);
		background.endFill();
		
		background.inputEnabled = true;
		background.input.useHandCursor = true;
		
		var label = game.add.text(90 - anchorX, 30 - anchorY, text, { font: '32px VT323', fill: '#ffffff', boundsAlignH: "center", boundsAlignV: "middle" });
		label.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		label.anchor.setTo(0.5, 0.5);
		
		button.add(background);
		button.add(label);
		
		return button;
	}
};

module.exports = UI;