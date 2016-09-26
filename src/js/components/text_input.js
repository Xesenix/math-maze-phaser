'use strict';
/* global Phaser */

var TextInput = function(game, x, y, key, text, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
	Phaser.Button.call(this, game, x, y, key, this.focus, this, overFrame, outFrame, downFrame, upFrame); 
	this.label = new Phaser.Text(game, 0, 0, text, { align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle' });
	this.label.anchor.setTo(0.5, 0.5);
	this.addChild(this.label);
	
	this.onChange = new Phaser.Signal();
	
	if (typeof callback !== 'undefined') {
		this.onChange.add(callback, callbackContext || this);
	}
	
	this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
};

TextInput.prototype = Object.create(Phaser.Button.prototype);
TextInput.prototype.constructor = TextInput;

TextInput.prototype.update = function() {
	//console.log('update', this.game.input.activePointer);
	if (this.game.input.activePointer.leftButton.isDown) {
		console.log('blur');
		this.focused = false;
	}
	
	/*if (this.game.input.activePointer.withinGame) {
		this.game.input.enabled = true;
		this.game.stage.backgroundColor = '#000';
	} else {
		this.game.input.enabled = false;
		this.game.stage.backgroundColor = '#ddd';
	}*/
};

TextInput.prototype.focus = function() {
	console.log('focus');
	this.focused = true;
};

TextInput.prototype.keyPress = function(char) {
	if (this.focused) {
		console.log('char', char);
		this.value += char;
		
		if (this.onChange) {
			this.onChange.dispatch(this.label.text);
		}
	}
};

Object.defineProperty(TextInput.prototype, 'value', {
    get: function() {
        return this.label.text;
    },

    set: function(value) {
         this.label.text = value;
    }
});

Object.defineProperty(TextInput.prototype, 'height', {

    get: function() {
        return this.scale.x * this.texture.frame.height;
    },

    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
		this.label.scale.y = this.texture.frame.height / value;
		this.label.y = this.label.scale.y * value * (0.5 - this.anchor.y);
    }

});

Object.defineProperty(TextInput.prototype, 'width', {

    get: function() {
        return this.scale.x * this.texture.frame.width;
    },

    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
		this.label.scale.x = this.texture.frame.width / value;
		this.label.x = this.label.scale.x * value * (0.5 - this.anchor.x);
    }

});

module.exports = TextInput;