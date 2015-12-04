// Ionic deals App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'deals' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'deals.services' is found in services.js
// 'deals.controllers' is found in controllers.js
angular.module('deals', ['ionic', 'deals.services', 'deals.controllers', 'ionic.rating', 'xeditable'])

.run(function($ionicPlatform, $cordovaPush, $rootScope, $window, editableOptions, $state, $ionicLoading) {
  
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

    // window.plugins.sim.getSimInfo(successCallback, errorCallback);

    
    // PUSH NOTIFICATIONS CONFIGURATION

    var push = PushNotification.init({ "android": {"senderID": SENDER_ID},
         "ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {} } );

    push.on('registration', function(data) {
        // data.registrationId
        // alert('data.registrationId: '+data.registrationId);
        window.localStorage['deviceId'] = JSON.stringify(data);
    });

    push.on('notification', function(data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
    });

    push.on('error', function(e) {
        // e.message
    });

    editableOptions.theme = 'bs3';
    
    if (localStorage.getItem("userData") === null) {
      $state.go('landing');
    }else{
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        template: 'Loading Deals...'
      });
      $state.go('app.deals');
    }

  });

})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

    .state('landing', {
      url: '/landing-home',
      templateUrl: 'templates/landing-home.html',
      controller: 'SignInCtrl',
      // resolve: {
      //       splash: function(AppInit) {
      //           return AppInit.splash();
      //       }
      //   }
    })
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/users/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('forgot', {
      url: '/forgot-password',
      templateUrl: 'templates/users/forgot.html',
      controller: 'ForgotCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/users/register.html',
      controller: 'RegisterCtrl'
    })
    .state('contactAdmin', {
      url: '/contact-admin',
      templateUrl: 'templates/pages/contact-admin.html',
      controller: 'SignInCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/global/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/pages/search.html'
        }
      }
    })
    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.deals', {
      url: '/deals',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/deals.html',
          controller: 'DealsCtrl'
        }
      }
    })
    .state('app.dealsFiltered', {
      url: '/deals/:sortType',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/deals.html',
          controller: 'DealsCtrl'
        }
      }
    })
    .state('app.myDeals', {
      url: '/my-deals',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/my-deals.html',
          controller: 'MyDeals'
        }
      }
    })
    .state('app.nationaldeals', {
      url: '/national-deals',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/national-deals.html',
          controller: 'DealsCtrl'
        }
      }
    })
    .state('app.localdeals', {
      url: '/local-deals',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/local-deals.html',
          controller: 'LocalDealsCtrl'
        }
      }
    })
    .state('app.createDeal', {
      url: '/create-deal',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/create-deal.html',
          controller: 'DealsCtrl'
        }
      }
    })
    .state('app.cloneDeal', {
      url: '/clone-deal/:dealId',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/clone-deal.html',
          controller: 'DealsCtrl'
        }
      }
    })
    .state('app.favourites', {
      url: '/favourites',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/favourites.html',
          controller: 'DealsCtrl'
        }
      }
    })
    .state('app.deal', {
      url: '/single-deal/:dealId',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/deal.html',
          controller: 'DealDetailCtrl'
        }
      }
    })
    .state('app.catDeal', {
      url: '/cat-deals/:catId/:catName',
      views: {
        'menuContent': {
          templateUrl: 'templates/deals/cat-deals.html',
          controller: 'CatDealsCtrl'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/pages/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/users/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.credits', {
      url: '/credits',
      views: {
        'menuContent': {
          templateUrl: 'templates/pages/credits.html',
          controller: 'CreditsCtrl'
        }
      }
    })
    .state('app.bizAddress', {
      url: '/biz-address',
      views: {
        'menuContent': {
          templateUrl: 'templates/pages/biz-address.html',
          controller: 'BizCtrl'
        }
      }
    })
    .state('app.myReviews', {
      url: '/my-reviews',
      views: {
        'menuContent': {
          templateUrl: 'templates/users/my-reviews.html',
          controller: 'ReviewsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landing-home');
});




