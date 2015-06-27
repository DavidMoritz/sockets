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
			$s.activeCards['track' + card.track] = _.reject($s.activeCards['track' + track], card);
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
			var message = card ? 'You have reserved the ' + card.name + ' card.' : 'Please choose a card to reserve';
			var answer = $s.currentPlayer.reservation || alertMessage(message, 'info');

			if (answer) {
				if (card) {
					return reserveCard(card);
				} else {
					$s.currentPlayer.reservation = true;
				}
			}

			if (!answer && !card) {
				$s.clearSelection();
			}

			return answer;
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
