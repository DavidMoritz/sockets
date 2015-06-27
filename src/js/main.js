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

			io.socket.on('game', function(game) {
				/**** This needs to be optimized ***/
				if(game.id === $s.gameId) {
					$s.game = game.data;
				}
			});
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
				index: $s.waitingPlayers.length
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
				$s.waitingPlayers.push(new Player(newUser));
			});
		}

		function replaceCard(card) {
			var track = 'track' + card.track;
			$s.game.activeCards[track] = _.reject($s.game.activeCards[track], card);
			dealCard(track);
		}

		function dealCard(track, skip) {
			$s.game.activeCards[track].push($s.game.allCards[track].splice(0, 1)[0]);
			if(!skip) {
				updateGame();
			}
		}

		function getCards() {
			io.socket.get('/card', {}, function getAllCards(allCards) {
				$s.game.allCards = _.shuffle(allCards);
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
					$s.game.allChips = $s.game.allChips.concat(gems);
				});
			});
		}

		function payForCard(card) {
			var tempChips = _.clone($s.game.currentPlayer.chips);
			var success = true;
			var payment = [];
			var cardPay, chipPay, goldPay, diff, chip;

			_.each(card.cost, function eachCost(value, gem) {
				if (success) {
					cardPay = _.where($s.game.currentPlayer.cards, {name: gem}).length;
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
				$s.game.currentPlayer.chips = tempChips;
				_.each(payment, function eachChip(chip) {
					$s.game.allChips.push(chip);
				});
			}

			return success;
		}

		function tileAvailable(tile) {
			var success = true;
			var cards;

			_.each(tile.cost, function eachCost(value, gem) {
				if (success) {
					cards = _.where($s.game.currentPlayer.cards, {name: gem}).length;
					success = cards >= value;
				}
			});

			return success;
		}

		function reserveCard(card) {
			var track = 'track' + card.track;
			var chip = _.find($s.game.allChips, {name: 'gold'});

			if ($s.game.currentPlayer.reserve.length > 2) {
				alertMessage('You can\'t reserve more than 3 cards', 'danger');

				return false;
			}
			$s.game.currentPlayer.reservation || alertMessage('You have reserved the ' + card.name + ' card.', 'info');
			$s.game.currentPlayer.reserve.push(card);
			replaceCard(card);
			delete $s.game.currentPlayer.reservation;

			if (chip) {
				$s.game.allChips = _.reject($s.game.allChips, {id: chip.id});
				$s.game.currentPlayer.chips.push(chip);
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
				$s.game.currentPlayer.reservation = true;
			}

			return true;
		}

		function login(authData) {
			io.socket.get('/user/', {uid: authData.uid}, function(users) {
				if (!users.length) {
					createNewUser(authData);
				} else {
					$s.currentUser = users[0];
					$s.waitingPlayers.push(new Player(users[0]));
				}
				$('body').addClass('logged-in');
				$s.ff.newPlayerName = '';
			});
		}

		function updateGame() {
			io.socket.put('/game/' + $s.gameId, $s.game);
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';

		//	initialize scoped variables
		_.assign($s, {
			time: moment().format(timeFormat),
			allChips: [],
			gameStatus: 'pre-game',
			ff: {
				newPlayerName: ''
			},
			game: {
				currentSelection: [],
				currentPlayer: {index: 0},
				allPlayers: [],
				game.activeCards: {
					track1: [],
					track2: [],
					track3: []
				},
			},
			activeTiles: [],
			cursor: {
				left: 0,
				top: 0
			}
		});

		$s.toggleReserve = function toggleReserve() {
			$s.currentUser.showReserve = !$s.currentUser.showReserve;
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
			var index = $s.game.currentPlayer.index + 1;

			if (index === $s.game.game.allPlayers.length) {
				index = 0;
			}
			$s.game.currentPlayer = player || _.find($s.game.game.allPlayers, {index: index});
			updateGame();
		};

		$s.startGame = function startGame() {
			var chipCount = $s.waitingPlayers.length === 4 ? 7 : $s.waitingPlayers.length + 2;
			var index = 0;

			for (var i = 1; i <= 3; i++) {
				for (var j = 1; j <= 4; j++) {
					dealCard('track' + i, false);
				}
			}

			dealTiles($s.waitingPlayers.length + 1);
			dealChips(chipCount);

			$s.gameStatus = 'game-started';
			_.each(_.shuffle($s.waitingPlayers), function(player) {
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
			if ($s.game.currentPlayer.name == player.name) {
				$s.collectCard(card);
			}
		};

		$s.collectCard = function collectCard(card) {
			var reserve = $s.game.currentPlayer.reservation;

			if (reserve || !$s.game.currentPlayer.auto) {
				reserve = confirmReserve(card);
			}

			if (!reserve && payForCard(card)) {
				$s.game.currentPlayer.cards.push(card);
				replaceCard(card);
			} else if (!reserve && !confirmReserve(card)) {
				return false;
			}
			$s.game.currentSelection = [];
			$s.changeCurrentPlayer();
		};

		$s.collectTile = function collectTile(tile) {
			if (tileAvailable(tile)) {
				$s.game.currentPlayer.tiles.push(tile);
				$s.activeTiles = _.reject($s.activeTiles, tile);
			}
			updateGame();
		};

		$s.collectChips = function collectChips() {
			var chip;
			_.each($s.game.currentSelection, function eachChip(gem) {
				chip = _.find($s.game.allChips, {name: gem});
				$s.game.allChips = _.reject($s.game.allChips, {id: chip.id});
				$s.game.currentPlayer.chips.push(chip);
			});
			$s.changeCurrentPlayer();
			$s.game.currentSelection = [];
		};

		$s.clearSelection = function clearSelection() {
			$s.game.currentSelection = [];
			delete $s.game.currentPlayer.reservation;
			updateGame();
		};

		$s.addChip = function addChip(gem) {
			if (gem === 'gold') {
				if ($s.game.currentPlayer.reserve.length < 3) {
					confirmReserve();
				} else {
					alertMessage('You already have 3 cards, you may not reserve another', 'danger');
				}
			} else {
				$s.game.currentSelection.push(_.clone(gem));
			}
			updateGame();
		};

		$s.gemAvailable = function notAvailable(gem) {
			var count = _.where($s.game.allChips, {name: gem}).length;

			switch (true) {
				case ($s.game.currentSelection.indexOf('gold') !== -1 && $s.game.currentPlayer.reserve.length < 3):
					// you have a gold or 3 reserved cards
					return false;
				case ($s.game.currentSelection.length && $s.game.currentSelection[0] === $s.game.currentSelection[1]):
					// you have two of the same gem
					return false;
				case ($s.game.currentSelection.length && $s.game.currentSelection[0].name === gem && count < 4):
					// there aren't enough gems for you to take two of the same
					return false;
				case ($s.game.currentSelection.length === 3):
					// you have three gems
					return false;
				case ($s.game.currentSelection.indexOf(gem) !== -1 && $s.game.currentSelection.length === 2):
					// you have two different gems, those two are not available
					return false;
				case ($s.game.currentSelection.length !== 0 && gem === 'gold'):
					// you have a gem, gold is not available
					return false;
			}

			return count > 0;
		};

		$s.howMany = function howMany(gem) {
			return _.where($s.game.allChips, {name: gem}).length;
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
