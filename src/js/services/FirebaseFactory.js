mainApp.factory('FirebaseFactory', [
	'$firebaseArray',
	'$firebaseObject',
	'$q',
	function FirebaseFactory($fbArray, $fbObject, $q) {
		'use strict';
		var FB = null;

		return {
			// Firebase methods
			getFB: function getFB(childPath) {
				if (!FB) {
					FB = new Firebase('https://splendid-gems.firebaseio.com/');
				}

				return childPath ? FB.child(childPath) : FB;
			},

			getFBArray: function getFBArray(childPath) {
				return $fbArray(this.getFB(childPath));
			},

			getFBObject: function getFBObject(childPath) {
				return $fbObject(this.getFB(childPath));
			},

			getAuth: function getFBAuth(childPath) {
				return $firebaseAuth(this.getFB(childPath));
			},

			setFB: function setFB(childPath, value) {
				var ref = this.getFB(childPath);
				ref.set(value);

				return false;
			},

			facebookLogin: function facebookLogin() {
				var ref = this.getFB();
				return $q(function(resolve, reject) {
					ref.authWithOAuthPopup('facebook', function facebookOAuth(error, authData) {
						if (error) {
							reject(console.log('Login Failed!', error));
						} else {
							console.log('Authenticated successfully with payload:', authData);
							resolve(authData);
						}
					}, {scope: 'user_friends'});
				});	
			}
		};
	}
]);
