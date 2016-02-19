// Ionic Starter App+
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var starter = angular.module('starter', ['ionic','starter.controllers','ngCookies','flash','angularMoment','ionic-datepicker','ngCordova'])

//var authScope = '1234567890po23sm45a56';
var authScope = 'front';
function checkloggedIn($rootScope, $http, $location) {
    $http.get('/front_patient/checkloggedin', {headers: {'auth-token': authScope}}).success(function(data) {
        if (data.error) {
          $location.path('/login');
        }
        else{
            $rootScope.user = data;
        }
    });  
}
//angular.module('starter', ['ionic', 'starter.controllers'])
starter
.run(function($ionicPlatform,$rootScope,$cordovaPush) {
  $ionicPlatform.ready(function() {
    
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

      /* PUSH NOTIFICATIONS CONFIGURATION as on ngCordova-- start */
            
            var push = PushNotification.init({
                  android: {senderID: "707879217713"},
                  ios: {alert: "true",badge: "true",sound: "true"},
                  windows: {}
            });
              
            push.on('registration', function(data) {
                  alert('registrationId \n'+data.registrationId);
                  localStorage.setItem("device_id", data.registrationId);
            });
              
            push.on('notification', function(data) {
                  // data.message,
                  // data.title,
                  // data.count,
                  // data.sound,
                  // data.image,
                  // data.additionalData
                  alert(JSON.stringify(data));
            });
              
            push.on('error', function(e) {
                  // e.message
                  alert(e);
            });
            
      /* PUSH NOTIFICATIONS CONFIGURATION -- end. */

  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      //abstract: true,
      templateUrl: 'templates/login.html',
      controller: 'authCtrl',
      flag:'login'
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
      //controller: 'AppCtrl'
    })
    .state('app.questionnaire', {
      url: '/questionnaire',
      flag: 'Notifications',
      views: {
        'menuContent': {
          templateUrl: 'templates/questionnaire.html',
          controller: 'NotificationCtrl'
        }
      },
      cache:false,
      resolve:{'logged_in':checkloggedIn}
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
    .state('app.fitbit', {
      cache:false,
      url: '/fitbit',
      flag: 'authorize',
      views: {
        'menuContent': {
          templateUrl: 'templates/fitbitdata.html',
          controller: 'FitbitCtrl',
        }
      }
    })
    //.state('app.fitbit', {
    //  cache:false,
    //  url: '/fitbit/hr',
    //  flag: 'hr',
    //  views: {
    //    'menuContent': {
    //      templateUrl: 'templates/fitbitdata.html',
    //      controller: 'FitbitCtrl',
    //    }
    //  }
    //})
    /*
    .state('app.questions', {
      cache:false,
      url: '/changepassword',
      flag: 'changepassword',
      views: {
        'menuContent': {
          templateUrl: 'templates/changepassword.html',
          controller: 'ChangepasswordCtrl',
        }
      }
    }) */
    .state('app.profile', {
      cache:false,
      url: '/profile',
      flag: 'profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'PatientCtrl',
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});