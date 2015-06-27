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