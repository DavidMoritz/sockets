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
