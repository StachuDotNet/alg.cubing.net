angular.module('algxApp')
.factory('touchBrowserService', function () {
    // currently unused.

    var isTouchBrowser = ("ontouchstart" in document.documentElement);

    // could return some isTouch function
});