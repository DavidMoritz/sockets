var mainApp = angular.module('mainApp', ['firebase', 'angular.filter']);

mainApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
	$rootScope.mc = mc;
});

/*
(function setUpFbConnect(document, script, id) {
	var firstScript = document.getElementsByTagName(script)[0];
	var newScript = document.createElement(script);

	if (document.getElementById(id)) {
		return;
	}
	newScript.id = id;
	newScript.src = '//connect.facebook.net/en_US/sdk.js';
	firstScript.parentNode.insertBefore(newScript, firstScript);
}(document, 'script', 'facebook-jssdk'));
*/
mainApp.controller('MainCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'$log',
	'MethodFactory',
	'FirebaseFactory',
	function MainCtrl($s, $timeout, $interval, $log, MF, FF) {
		'use strict';

		function init() {
			//	init stuff
			window.$s = $s;

			getGems();

			/**
			// remove scrolling also removes click and drag
			window.addEventListener('touchmove', function disallowScrolling(event) {
				if ($(document).width() >= 768) {
					event.preventDefault();
				}
			}, false);
			*/

			// subscribe to "/cursor"
			io.socket.get('/cursor');

			io.socket.on('cursor',function(obj){
				cursor.style.left = obj.data.left;
				cursor.style.top = obj.data.top;
			});

			$s.predicate = '-id';
			$s.reverse = false;
			$s.chatList = [];
			$s.chatUser = "nikkyBot"
			$s.chatMessage="";

			io.socket.on('chat',function(obj){
				if(obj.verb === 'created'){
					$log.info(obj)
					$s.chatList.push(obj.data);
					$s.$digest();
				}
				$log.info("Hi! How are you?");
				$log.info(obj)
			});

			$s.sendMsg = function(){
				$log.info($s.chatMessage);
				io.socket.post('/chat/addconv/',{
					user:$s.chatUser,
					message: $s.chatMessage + "n: "
				});
				$s.chatMessage = "";
			};
		}

		function Player(player) {
			_.extend(this, player, {
				chips: [],
				cards: [],
				tiles: [],
				reserve: [],
				index: $s.allPlayers.length
			});
		}

		function createNewUser(authData) {			
			io.socket.post('/user/create/',{
				name: authData.facebook.displayName,
				rating: 1200,
				uid: authData.uid,
				gender: authData.facebook.cachedUserProfile.gender,
				firstName: authData.facebook.cachedUserProfile.first_name,
				lastName: authData.facebook.cachedUserProfile.last_name,
				picture: authData.facebook.cachedUserProfile.picture.data.url,
				timezone: authData.facebook.cachedUserProfile.timezone
			}, function(newUser) {
				$s.currentUser = newUser;
				$s.allPlayers.push(new Player(newUser));
			});
		}

		function replaceCard(card) {
			$s.activeCards['track' + card.track] = _.reject($s.activeCards['track' + card.track], card);
			dealCards(card.track, 1);
		}

		function dealCards(track, count) {
			io.socket.get('/card', {track: track}, function getCards(cards) {
				$s.activeCards['track' + track] = _.shuffle(cards).splice(0, count);
			});
		}

		function getGems() {
			io.socket.get('/gem', {}, function getAllGems(allGems) {
				$s.allGems = allGems;
			});
		}

		function dealTiles(count) {
			io.socket.get('/tile', {}, function(tiles) {
				$s.activeTiles = _.shuffle(tiles).splice(0, count);
			});
		}

		function dealChips(count) {
			_.each($s.allGems, function eachGem(gem) {
				io.socket.get('/chip/', {
					gem: gem.name,
					limit: gem.name === 'gold' ? 5 : count
				}, function(gems) {
					$s.allChips = $s.allChips.concat(gems);
				});
			});
		}

		function payForCard(card) {
			var tempChips = _.clone($s.currentPlayer.chips);
			var success = true;
			var payment = [];
			var cardPay, chipPay, goldPay, diff, chip;

			_.each(card.cost, function eachCost(value, gem) {
				if (success) {
					cardPay = _.where($s.currentPlayer.cards, {name: gem}).length;
					chipPay = _.where(tempChips, {name: gem}).length;
					goldPay = _.where(tempChips, {name: 'gold'}).length;
					diff = value - cardPay;

					if (diff > (chipPay + goldPay)) {
						success = false;
					} else {
						for (diff; diff > 0 && chipPay > 0; diff--) {
							chip = _.find(tempChips, {name: gem});
							tempChips = _.reject(tempChips, {id: chip.id});
							payment.push(chip);
							chipPay--;
						}

						for (diff; diff > 0; diff--) {
							chip = _.find(tempChips, {name: 'gold'});
							tempChips = _.reject(tempChips, {id: chip.id});
							payment.push(chip);
						}
					}
				}
			});

			if (success) {
				$s.currentPlayer.chips = tempChips;
				_.each(payment, function eachChip(chip) {
					$s.allChips.push(chip);
				});
			}

			return success;
		}

		function tileAvailable(tile) {
			var success = true;
			var cards;

			_.each(tile.cost, function eachCost(value, gem) {
				if (success) {
					cards = _.where($s.currentPlayer.cards, {name: gem}).length;
					success = cards >= value;
				}
			});

			return success;
		}

		function reserveCard(card) {
			var track = 'track' + card.track;
			var chip = _.find($s.allChips, {name: 'gold'});

			if ($s.currentPlayer.reserve.length > 2) {
				alertMessage('You can\'t reserve more than 3 cards', 'danger');

				return false;
			}
			$s.currentPlayer.reservation || alertMessage('You have reserved the ' + card.name + ' card.', 'info');
			$s.currentPlayer.reserve.push(card);
			replaceCard(card);
			delete $s.currentPlayer.reservation;

			if (chip) {
				$s.allChips = _.reject($s.allChips, {id: chip.id});
				$s.currentPlayer.chips.push(chip);
			}

			return true;
		}

		function alertMessage(message, type) {
			$('<div>', {
				class: 'click-remove alert alert-' + type,
				text: message,
				'ng-click': 'remove($event)'
			}).appendTo('.jumbotron');
		}

		function confirmReserve(card) {
			if (card) {
				return reserveCard(card);
			} else {
				alertMessage('Please choose a card to reserve.', 'info');
				$s.currentPlayer.reservation = true;
			}

			return true;
		}

		function login(authData) {
			io.socket.get('/user/', {uid: authData.uid}, function(users) {
				if (!users.length) {
					createNewUser(authData);
				} else {
					$s.currentUser = users[0];
					$s.allPlayers.push(new Player(users[0]));
				}
				$('body').addClass('logged-in');
				$s.ff.newPlayerName = '';
			});
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';

		//	initialize scoped variables
		_.assign($s, {
			time: moment().format(timeFormat),
			allPlayers: [],
			allChips: [],
			gameStatus: 'pre-game',
			ff: {
				newPlayerName: ''
			},
			currentSelection: [],
			currentPlayer: {index: 0},
			activeTiles: [],
			activeCards: {
				track1: [],
				track2: [],
				track3: []
			},
			cursor: {
				left: 0,
				top: 0
			}
		});

		$s.toggleReserve = function toggleReserve(player) {
			player.showReserve = !player.showReserve;
		};

		$s.calculatePoints = function calculatePoints(player) {
			var total = _.reduce(player.cards, function sumCards(total, card) {
				return total + card.points;
			}, 0);

			return _.reduce(player.tiles, function sumTiles(total, tile) {
				return total + tile.points;
			}, total);
		};

		$s.changeCurrentPlayer = function changeCurrentPlayer(player) {
			var index = $s.currentPlayer.index + 1;

			if (index === $s.allPlayers.length) {
				index = 0;
			}
			$s.currentPlayer = player || _.find($s.allPlayers, {index: index});
		};

		$s.startGame = function startGame() {
			var chipCount = $s.allPlayers.length === 4 ? 7 : $s.allPlayers.length + 2;
			var index = 0;

			for (var i = 1; i <= 3; i++) {
				dealCards(i, 4);
			}

			dealTiles($s.allPlayers.length + 1);
			dealChips(chipCount);

			$s.gameStatus = 'game-started';
			_.each(_.shuffle($s.allPlayers), function(player) {
				player.index = index++;
			});
			$s.changeCurrentPlayer();
		};

		$s.quickStart = function quickStart() {
			login({uid: "guest:123423"});
			login({uid: "guest:235321"});
			login({uid: "guest:353234"});
		};

		$s.collectReserveCard = function collectReserveCard(player, card) {
			if ($s.currentPlayer.name == player.name) {
				$s.collectCard(card);
			}
		};

		$s.collectCard = function collectCard(card) {
			var reserve = $s.currentPlayer.reservation;

			if (reserve || !$s.currentPlayer.auto) {
				reserve = confirmReserve(card);
			}

			if (!reserve && payForCard(card)) {
				$s.currentPlayer.cards.push(card);
				replaceCard(card);
			} else if (!reserve && !confirmReserve(card)) {
				return false;
			}
			$s.currentSelection = [];
			$s.changeCurrentPlayer();
		};

		$s.collectTile = function collectTile(tile) {
			if (tileAvailable(tile)) {
				$s.currentPlayer.tiles.push(tile);
				$s.activeTiles = _.reject($s.activeTiles, tile);
			}
		};

		$s.collectChips = function collectChips() {
			var chip;
			_.each($s.currentSelection, function eachChip(gem) {
				chip = _.find($s.allChips, {name: gem});
				$s.allChips = _.reject($s.allChips, {id: chip.id});
				$s.currentPlayer.chips.push(chip);
			});
			$s.changeCurrentPlayer();
			$s.currentSelection = [];
		};

		$s.clearSelection = function clearSelection() {
			$s.currentSelection = [];
			delete $s.currentPlayer.reservation;
		};

		$s.addChip = function addChip(gem) {
			if (gem === 'gold') {
				if ($s.currentPlayer.reserve.length < 3) {
					confirmReserve();
				} else {
					alertMessage('You already have 3 cards, you may not reserve another', 'danger');
				}
			} else {
				$s.currentSelection.push(_.clone(gem));
			}
		};

		$s.gemAvailable = function notAvailable(gem) {
			var count = _.where($s.allChips, {name: gem}).length;

			switch (true) {
				case ($s.currentSelection.indexOf('gold') !== -1 && $s.currentPlayer.reserve.length < 3):
					// you have a gold or 3 reserved cards
					return false;
				case ($s.currentSelection.length && $s.currentSelection[0] === $s.currentSelection[1]):
					// you have two of the same gem
					return false;
				case ($s.currentSelection.length && $s.currentSelection[0].name === gem && count < 4):
					// there aren't enough gems for you to take two of the same
					return false;
				case ($s.currentSelection.length === 3):
					// you have three gems
					return false;
				case ($s.currentSelection.indexOf(gem) !== -1 && $s.currentSelection.length === 2):
					// you have two different gems, those two are not available
					return false;
				case ($s.currentSelection.length !== 0 && gem === 'gold'):
					// you have a gem, gold is not available
					return false;
			}

			return count > 0;
		};

		$s.howMany = function howMany(gem) {
			return _.where($s.allChips, {name: gem}).length;
		};

		$s.removeThis = function remove(e) {
			$(e.target).closest('.click-remove').hide();
		};

		$s.moveCursor = function moveCursor(e) {
			io.socket.put('/cursor/2',{
				left: (e.pageX + 2) + 'px',
				top: (e.pageY + 2) + 'px'
			});
		};

		$s.newGuestPlayer = function newGuestPlayer() {
			login({
				rating: 1200,
				uid: 'guest:' + moment().format('YYMMDD-HHmmssSS'),
				facebook: {
					displayName: $s.ff.newPlayerName,
					cachedUserProfile: {
						gender: 'unknown',
						first_name: $s.ff.newPlayerName,
						last_name: 'Guest',
						timezone: '-5',
						picture: {
							data: {
								url: 'http://lorempixel.com/100/100/animals/'
							}
						}
					}
				}
			});
		};

		$s.fbLogin = function facebookLogin() {
			var promise = FF.facebookLogin();

			promise.then(function(authData) {
				login(authData);
			});
		};

		$s.firebook = FF.getFBArray('facebook');
		$s.firebook.$loaded(function afterFirebookLoaded() {
			$('.notices').text('Firebase is working!');
			$('body').addClass('facebook-available');
		});

		init();
	}
]);

mainApp.factory('CardFactory', [
	function CardFactory() {
		'use strict';

		return {
			allCards: [{
				id: 'S11',
				track: 1,
				gem: 'sapphire',
				cost: {
					ruby: 4
				},
				points: 1
			}, {
				id: 'S12',
				track: 1,
				gem: 'sapphire',
				cost: {
					sapphire: 1,
					emerald: 3,
					ruby: 1
				}
			}, {
				id: 'S13',
				track: 1,
				gem: 'sapphire',
				cost: {
					onyx: 3
				}
			}, {
				id: 'S14',
				track: 1,
				gem: 'sapphire',
				cost: {
					diamond: 1,
					emerald: 2,
					ruby: 2
				}
			}, {
				id: 'S15',
				track: 1,
				gem: 'sapphire',
				cost: {
					emerald: 2,
					onyx: 2
				}
			}, {
				id: 'S16',
				track: 1,
				gem: 'sapphire',
				cost: {
					diamond: 1,
					emerald: 1,
					ruby: 2,
					onyx: 1
				}
			}, {
				id: 'S17',
				track: 1,
				gem: 'sapphire',
				cost: {
					diamond: 1,
					onyx: 2
				}
			}, {
				id: 'S18',
				track: 1,
				gem: 'sapphire',
				cost: {
					diamond: 1,
					emerald: 1,
					ruby: 1,
					onyx: 1
				}
			}, {
				id: 'O11',
				track: 1,
				gem: 'onyx',
				cost: {
					sapphire: 4
				},
				points: 1
			}, {
				id: 'O12',
				track: 1,
				gem: 'onyx',
				cost: {
					emerald: 1,
					ruby: 3,
					onyx: 1
				}
			}, {
				id: 'O13',
				track: 1,
				gem: 'onyx',
				cost: {
					emerald: 3
				}
			}, {
				id: 'O14',
				track: 1,
				gem: 'onyx',
				cost: {
					diamond: 2,
					sapphire: 2,
					ruby: 1
				}
			}, {
				id: 'O15',
				track: 1,
				gem: 'onyx',
				cost: {
					diamond: 2,
					emerald: 2
				}
			}, {
				id: 'O16',
				track: 1,
				gem: 'onyx',
				cost: {
					diamond: 1,
					sapphire: 2,
					emerald: 1,
					ruby: 1
				}
			}, {
				id: 'O17',
				track: 1,
				gem: 'onyx',
				cost: {
					emerald: 2,
					ruby: 1
				}
			}, {
				id: 'O18',
				track: 1,
				gem: 'onyx',
				cost: {
					diamond: 1,
					sapphire: 1,
					emerald: 1,
					ruby: 1
				}
			}, {
				id: 'E11',
				track: 1,
				gem: 'emerald',
				cost: {
					onyx: 4
				},
				points: 1
			}, {
				id: 'E12',
				track: 1,
				gem: 'emerald',
				cost: {
					diamond: 1,
					sapphire: 3,
					emerald: 1
				}
			}, {
				id: 'E13',
				track: 1,
				gem: 'emerald',
				cost: {
					ruby: 3
				}
			}, {
				id: 'E14',
				track: 1,
				gem: 'emerald',
				cost: {
					sapphire: 1,
					ruby: 2,
					onyx: 2
				}
			}, {
				id: 'E15',
				track: 1,
				gem: 'emerald',
				cost: {
					sapphire: 2,
					ruby: 2
				}
			}, {
				id: 'E16',
				track: 1,
				gem: 'emerald',
				cost: {
					diamond: 1,
					sapphire: 1,
					ruby: 1,
					onyx: 2
				}
			}, {
				id: 'E17',
				track: 1,
				gem: 'emerald',
				cost: {
					diamond: 2,
					sapphire: 1
				}
			}, {
				id: 'E18',
				track: 1,
				gem: 'emerald',
				cost: {
					diamond: 1,
					sapphire: 1,
					ruby: 1,
					onyx: 1
				}
			}, {
				id: 'R11',
				track: 1,
				gem: 'ruby',
				cost: {
					diamond: 4
				},
				points: 1
			}, {
				id: 'R12',
				track: 1,
				gem: 'ruby',
				cost: {
					diamond: 1,
					ruby: 1,
					onyx: 3
				}
			}, {
				id: 'R13',
				track: 1,
				gem: 'ruby',
				cost: {
					diamond: 3
				}
			}, {
				id: 'R14',
				track: 1,
				gem: 'ruby',
				cost: {
					diamond: 2,
					emerald: 1,
					onyx: 2
				}
			}, {
				id: 'R15',
				track: 1,
				gem: 'ruby',
				cost: {
					diamond: 2,
					ruby: 2
				}
			}, {
				id: 'R16',
				track: 1,
				gem: 'ruby',
				cost: {
					diamond: 2,
					sapphire: 1,
					emerald: 1,
					onyx: 1
				}
			}, {
				id: 'R17',
				track: 1,
				gem: 'ruby',
				cost: {
					sapphire: 2,
					emerald: 1
				}
			}, {
				id: 'R18',
				track: 1,
				gem: 'ruby',
				cost: {
					diamond: 1,
					sapphire: 1,
					emerald: 1,
					onyx: 1
				}
			}, {
				id: 'D11',
				track: 1,
				gem: 'diamond',
				cost: {
					emerald: 4
				},
				points: 1
			}, {
				id: 'D12',
				track: 1,
				gem: 'diamond',
				cost: {
					diamond: 3,
					sapphire: 1,
					onyx: 1
				}
			}, {
				id: 'D13',
				track: 1,
				gem: 'diamond',
				cost: {
					sapphire: 3
				}
			}, {
				id: 'D14',
				track: 1,
				gem: 'diamond',
				cost: {
					sapphire: 2,
					emerald: 2,
					onyx: 1
				}
			}, {
				id: 'D15',
				track: 1,
				gem: 'diamond',
				cost: {
					sapphire: 2,
					onyx: 2
				}
			}, {
				id: 'D16',
				track: 1,
				gem: 'diamond',
				cost: {
					sapphire: 1,
					emerald: 2,
					ruby: 1,
					onyx: 1
				}
			}, {
				id: 'D17',
				track: 1,
				gem: 'diamond',
				cost: {
					ruby: 2,
					onyx: 1
				}
			}, {
				id: 'D18',
				track: 1,
				gem: 'diamond',
				cost: {
					sapphire: 1,
					emerald: 1,
					ruby: 1,
					onyx: 1
				}
			}, {
				id: 'S21',
				track: 2,
				gem: 'sapphire',
				cost: {
					sapphire: 6
				},
				points: 3
			}, {
				id: 'S22',
				track: 2,
				gem: 'sapphire',
				cost: {
					diamond: 5,
					sapphire: 3
				},
				points: 2
			}, {
				id: 'S23',
				track: 2,
				gem: 'sapphire',
				cost: {
					sapphire: 5
				},
				points: 2
			}, {
				id: 'S24',
				track: 2,
				gem: 'sapphire',
				cost: {
					diamond: 2,
					ruby: 1,
					onyx: 4
				},
				points: 2
			}, {
				id: 'S25',
				track: 2,
				gem: 'sapphire',
				cost: {
					sapphire: 2,
					emerald: 3,
					onyx: 3
				},
				points: 1
			}, {
				id: 'S26',
				track: 2,
				gem: 'sapphire',
				cost: {
					sapphire: 2,
					emerald: 2,
					ruby: 3
				},
				points: 1
			}, {
				id: 'O21',
				track: 2,
				gem: 'onyx',
				cost: {
					onyx: 6
				},
				points: 3
			}, {
				id: 'O22',
				track: 2,
				gem: 'onyx',
				cost: {
					emerald: 5,
					ruby: 3
				},
				points: 2
			}, {
				id: 'O23',
				track: 2,
				gem: 'onyx',
				cost: {
					diamond: 5
				},
				points: 2
			}, {
				id: 'O24',
				track: 2,
				gem: 'onyx',
				cost: {
					sapphire: 1,
					emerald: 4,
					ruby: 2
				},
				points: 2
			}, {
				id: 'O25',
				track: 2,
				gem: 'onyx',
				cost: {
					diamond: 3,
					emerald: 3,
					onyx: 2
				},
				points: 1
			}, {
				id: 'O26',
				track: 2,
				gem: 'onyx',
				cost: {
					diamond: 3,
					sapphire: 2,
					emerald: 2
				},
				points: 1
			}, {
				id: 'E21',
				track: 2,
				gem: 'emerald',
				cost: {
					emerald: 6
				},
				points: 3
			}, {
				id: 'E22',
				track: 2,
				gem: 'emerald',
				cost: {
					sapphire: 5,
					emerald: 3
				},
				points: 2
			}, {
				id: 'E23',
				track: 2,
				gem: 'emerald',
				cost: {
					emerald: 5
				},
				points: 2
			}, {
				id: 'E24',
				track: 2,
				gem: 'emerald',
				cost: {
					diamond: 4,
					sapphire: 2,
					onyx: 1
				},
				points: 2
			}, {
				id: 'E25',
				track: 2,
				gem: 'emerald',
				cost: {
					diamond: 3,
					emerald: 2,
					ruby: 3
				},
				points: 1
			}, {
				id: 'E26',
				track: 2,
				gem: 'emerald',
				cost: {
					diamond: 2,
					sapphire: 3,
					onyx: 2
				},
				points: 1
			}, {
				id: 'R21',
				track: 2,
				gem: 'ruby',
				cost: {
					ruby: 6
				},
				points: 3
			}, {
				id: 'R22',
				track: 2,
				gem: 'ruby',
				cost: {
					diamond: 3,
					onyx: 5
				},
				points: 2
			}, {
				id: 'R23',
				track: 2,
				gem: 'ruby',
				cost: {
					onyx: 5
				},
				points: 2
			}, {
				id: 'R24',
				track: 2,
				gem: 'ruby',
				cost: {
					diamond: 1,
					sapphire: 4,
					emerald: 2
				},
				points: 2
			}, {
				id: 'R25',
				track: 2,
				gem: 'ruby',
				cost: {
					sapphire: 3,
					ruby: 2,
					onyx: 3
				},
				points: 1
			}, {
				id: 'R26',
				track: 2,
				gem: 'ruby',
				cost: {
					diamond: 2,
					ruby: 2,
					onyx: 3
				},
				points: 1
			}, {
				id: 'D21',
				track: 2,
				gem: 'diamond',
				cost: {
					diamond: 6
				},
				points: 3
			}, {
				id: 'D22',
				track: 2,
				gem: 'diamond',
				cost: {
					ruby: 5,
					onyx: 3
				},
				points: 2
			}, {
				id: 'D23',
				track: 2,
				gem: 'diamond',
				cost: {
					ruby: 5
				},
				points: 2
			}, {
				id: 'D24',
				track: 2,
				gem: 'diamond',
				cost: {
					emerald: 1,
					ruby: 4,
					onyx: 2
				},
				points: 2
			}, {
				id: 'D25',
				track: 2,
				gem: 'diamond',
				cost: {
					diamond: 2,
					sapphire: 3,
					ruby: 3
				},
				points: 1
			}, {
				id: 'D26',
				track: 2,
				gem: 'diamond',
				cost: {
					emerald: 3,
					ruby: 2,
					onyx: 2
				},
				points: 1
			}, {
				id: 'S31',
				track: 3,
				gem: 'sapphire',
				cost: {
					diamond: 7,
					sapphire: 3
				},
				points: 5
			}, {
				id: 'S32',
				track: 3,
				gem: 'sapphire',
				cost: {
					diamond: 7
				},
				points: 4
			}, {
				id: 'S33',
				track: 3,
				gem: 'sapphire',
				cost: {
					diamond: 6,
					sapphire: 3,
					onyx: 3
				},
				points: 4
			}, {
				id: 'S34',
				track: 3,
				gem: 'sapphire',
				cost: {
					diamond: 3,
					emerald: 3,
					ruby: 3,
					onyx: 5
				},
				points: 3
			}, {
				id: 'O31',
				track: 3,
				gem: 'onyx',
				cost: {
					ruby: 7,
					onyx: 3
				},
				points: 5
			}, {
				id: 'O32',
				track: 3,
				gem: 'onyx',
				cost: {
					ruby: 7
				},
				points: 4
			}, {
				id: 'O33',
				track: 3,
				gem: 'onyx',
				cost: {
					emerald: 3,
					ruby: 6,
					onyx: 3
				},
				points: 4
			}, {
				id: 'O34',
				track: 3,
				gem: 'onyx',
				cost: {
					diamond: 3,
					sapphire: 3,
					emerald: 5,
					ruby: 3
				},
				points: 3
			}, {
				id: 'E31',
				track: 3,
				gem: 'emerald',
				cost: {
					sapphire: 7,
					emerald: 3
				},
				points: 5
			}, {
				id: 'E32',
				track: 3,
				gem: 'emerald',
				cost: {
					sapphire: 7
				},
				points: 4
			}, {
				id: 'E33',
				track: 3,
				gem: 'emerald',
				cost: {
					diamond: 3,
					sapphire: 6,
					emerald: 3
				},
				points: 4
			}, {
				id: 'E34',
				track: 3,
				gem: 'emerald',
				cost: {
					diamond: 5,
					sapphire: 3,
					ruby: 3,
					onyx: 3
				},
				points: 3
			}, {
				id: 'R31',
				track: 3,
				gem: 'ruby',
				cost: {
					emerald: 7,
					ruby: 3
				},
				points: 5
			}, {
				id: 'R32',
				track: 3,
				gem: 'ruby',
				cost: {
					emerald: 7
				},
				points: 4
			}, {
				id: 'R33',
				track: 3,
				gem: 'ruby',
				cost: {
					sapphire: 3,
					emerald: 6,
					ruby: 3
				},
				points: 4
			}, {
				id: 'R34',
				track: 3,
				gem: 'ruby',
				cost: {
					diamond: 3,
					sapphire: 5,
					emerald: 3,
					onyx: 3
				},
				points: 3
			}, {
				id: 'D31',
				track: 3,
				gem: 'diamond',
				cost: {
					diamond: 3,
					onyx: 7
				},
				points: 5
			}, {
				id: 'D32',
				track: 3,
				gem: 'diamond',
				cost: {
					onyx: 7
				},
				points: 4
			}, {
				id: 'D33',
				track: 3,
				gem: 'diamond',
				cost: {
					diamond: 3,
					emerald: 3,
					onyx: 6
				},
				points: 4
			}, {
				id: 'D34',
				track: 3,
				gem: 'diamond',
				cost: {
					sapphire: 3,
					emerald: 3,
					ruby: 5,
					onyx: 3
				},
				points: 3
			}],
			allTiles: [{
				id: 'T1',
				cost: {
					diamond: 4,
					sapphire: 4
				},
				points: 3
			}, {
				id: 'T2',
				cost: {
					sapphire: 4,
					emerald: 4
				},
				points: 3
			}, {
				id: 'T3',
				cost: {
					emerald: 4,
					ruby: 4
				},
				points: 3
			}, {
				id: 'T4',
				cost: {
					ruby: 4,
					onyx: 4
				},
				points: 3
			}, {
				id: 'T5',
				cost: {
					diamond: 4,
					onyx: 4
				},
				points: 3
			}, {
				id: 'T6',
				cost: {
					diamond: 3,
					sapphire: 3,
					emerald: 3
				},
				points: 3
			}, {
				id: 'T7',
				cost: {
					sapphire: 3,
					emerald: 3,
					ruby: 3
				},
				points: 3
			}, {
				id: 'T8',
				cost: {
					emerald: 3,
					ruby: 3,
					onyx: 3
				},
				points: 3
			}, {
				id: 'T9',
				cost: {
					diamond: 3,
					ruby: 3,
					onyx: 3
				},
				points: 3
			}, {
				id: 'T10',
				cost: {
					diamond: 3,
					sapphire: 3,
					onyx: 3
				},
				points: 3
			}]
		};
	}
]);

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

mainApp.factory('GemFactory', [
	function GemFactory() {
		'use strict';

		return {
			allGems: [{
				name: 'emerald',
				display: 'Emerald',
				btnClass: 'success',
				color: 'green'
			}, {
				name: 'onyx',
				display: 'Onyx',
				btnClass: 'warning',
				color: 'orange'
			}, {
				name: 'ruby',
				display: 'Ruby',
				btnClass: 'danger',
				color: 'red'
			}, {
				name: 'sapphire',
				display: 'Sapphire',
				btnClass: 'primary',
				color: 'blue'
			}, {
				name: 'diamond',
				display: 'Diamond',
				btnClass: 'default',
				color: 'white'
			}, {
				name: 'gold',
				display: 'Gold',
				btnClass: 'gold',
				color: 'yellow'
			}]
		};
	}
]);

mainApp.factory('MethodFactory', [
	function MethodFactory() {
		'use strict';

		return {
			// common methods
		};
	}
]);

var mc = {
	pluralize: function pluralize(str) {
		return str.replace(/y$/, 'ie') + 's';
	},

	camelToTitle: function camelToTitle(str) {	//	convert camelCaseString to Title Case String
		return _.capitalize(str.replace(/([A-Z])/g, ' $1')).trim();
	},

	randomDigits: function randomDigits(min, max) {
		min = min === undefined ? 1 : min;
		max = max || 999;

		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),

	isAngularObjectEqual: function isAngularObjectEqual(object1, object2) {
		return _.isEqual(_.omit(object1, '$$hashKey'), _.omit(object2, '$$hashKey'));
	},

	expandArray: function expandArray(array, times) {	//	turns [1,2,3] into [1,2,3,1,2,3,1,2,3];
		times = times || 3;	//	default number of times to expand it by

		var expandedArray = [];

		for (var i = 0; i < times; i++) {
			expandedArray = expandedArray.concat(angular.copy(array));
		}

		return expandedArray;
	},

	calculateAge: function calculateAge(dateOfBirth) {
		var age;

		if (dateOfBirth) {
			var year = Number(dateOfBirth.substr(0, 4));
			var month = Number(dateOfBirth.substr(5, 2)) - 1;
			var day = Number(dateOfBirth.substr(8, 2));
			var today = new Date();
			age = today.getFullYear() - year;

			if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
				age--;
			}
		}

		return age || 0;
	}
};
