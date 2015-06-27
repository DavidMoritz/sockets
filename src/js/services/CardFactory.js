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
