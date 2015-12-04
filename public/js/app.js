// Ionic Starter App+
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic','starter.controllers','ngCookies'])
//angular.module('starter', ['ionic', 'starter.controllers'])
starter
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      //abstract: true,
      templateUrl: 'templates/login.html',
      controller: 'authCtrl'
    })
    .state('logout', {
      url: '/logout',
      flag : 'logout',
      //abstract: true,
      templateUrl: 'templates/login.html',
      controller: 'authCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.questionnaire', {
      url: '/questionnaire',
      flag: 'notifications',
      views: {
        'menuContent': {
          templateUrl: 'templates/questionnaire.html',
          controller: 'NotificationCtrl',
        }
      },
      cache:false
    })
    .state('app.questions', {
      cache:false,
      url: '/questions/:id',
      flag: 'questions',
      views: {
        'menuContent': {
          templateUrl: 'templates/questions.html',
          controller: 'QuestionsCtrl',
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});