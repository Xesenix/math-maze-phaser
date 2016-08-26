'use strict';
/* global localStorage, kongregateAPI */
var Promise = require('promise');
var kongregate = null;

var authenticationPromise = null;

var InitApi = new Promise(function(resolve) {
	console.log('init kongregate api');
	if (kongregate === null) {
		console.log('load kongregate api', kongregate);
		kongregateAPI.loadAPI(function () {
			kongregate = kongregateAPI.getAPI();
			console.log('kongregate ready', kongregate);
			
			kongregate.services.addEventListener('login', function() {
				console.log('authenticated');
				authenticationPromise.resolve();
			});
			
			console.log('resolve kongregate api');
			resolve();
		});
	} else {
		console.log('return kongregate api');
		resolve();
	}
});

var API = {
	init: function() {
		authenticationPromise = new Promise(function(resolve) {
			if (!API.user.guest) {
				resolve();
			}
		});
		return this.getUser();
	},
	authenticate: function() {
		return authenticationPromise;
	},
	user: null,
	getUser: function() {
		return InitApi
			.then(function() {
				API.user = {
					userId: kongregate.services.getUserId(),
					username: kongregate.services.getUsername(),
					token: kongregate.services.getGameAuthToken(),
					guest: kongregate.services.isGuest()
				};
				
				console.log('getUserData', kongregate.services.isGuest(), API.user);
			});
	},
	getUserData: function(key) {
		return API.getUser()
			.then(function() {
				// TODO: replace with playfab implementation
				return JSON.parse(localStorage.getItem(key));
			});
	},
	setUserData: function(key, value) {
		return API.getUser()
			.then(function() {
				// TODO: replace with playfab implementation
				localStorage.setItem(key, JSON.stringify(value));
			});
	}
};

module.exports = API;