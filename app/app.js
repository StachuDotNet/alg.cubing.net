"use strict";

var ss;
var l;


angular.module('algxApp', [
  'debounce',
  'monospaced.elastic',
  'ngClipboard'
]).config(['$locationProvider',
  function ($locationProvider) {
      $locationProvider.html5Mode(true);
  }]);