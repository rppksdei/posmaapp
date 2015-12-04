angular.module('deals.controllers', ['ngCordova', 'xeditable', 'ngSanitize'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, DealService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/users/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  
  // LOGOUT USER FROM APP
  $scope.logout = function() {
    // $scope.modal.show();
    console.log('logout');
    localStorage.clear();
    $state.go('landing');
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


  if (localStorage.getItem("userData") === null) {
    console.log('Its NULL') ;
    $state.go('landing');
  }else{
    $scope.userData = JSON.parse(window.localStorage['userData']);
    // console.log($scope.userData);
  }


  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.group = 'deals';


  /* SETTING DEALS CENTER MENU */

  DealService.findAllDealCategories().then(function (categories) {
    $scope.dealCategories = categories.data.data;
  });

})
.controller('LandingInCtrl', function($scope, $state) {
  
  $scope.gotoRegister = function() {
    console.log('register');
    $state.go('register');
  };

  $scope.gotoLogin = function() {
    console.log('Sign-In');
    $state.go('signin');
  };

})
.controller('SettingsCtrl', function($scope, $state) {
  
  $scope.check = function() {
    console.log('check');
  };

})
.controller('ProfileCtrl', function($scope, $state, ProfileService, $ionicLoading, $ionicPopup) {
  
  $scope.check = function() {
    console.log('check');
  };

  $scope.profilePicPath = PROFILE_PIC;
  
  if (localStorage.getItem("userData") === null) {
    $state.go('landing');
  }else{
    $scope.userData = JSON.parse(window.localStorage['userData']);
    ProfileService.findProfileDetailsById($scope.userData.session_id).then(function(data) { 
      $scope.userProfileData = data.data.data;
    });
    
  }

  $scope.saveUser = function(userProfileData) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    console.log(userProfileData);

    ProfileService.editProfile(userProfileData).success(function(data){
        
        console.log(data);

        $ionicLoading.hide();
        
        if (data.code == 200) {

          var alertPopup = $ionicPopup.alert({
              title:    'Profile Details Updated!',
              template: 'Your profile details has been updated successfully.',
              buttons:[
                {
                  text: '<b>Ok</b>',
                  type: 'pink-white-theme-color'
                }
              ]
          });

          $state.go($state.current, {}, {reload: true});

        }else {

          var alertPopup = $ionicPopup.alert({
            title:    'Anonymous failed!',
            template: 'Oop\'s! it seems like something went wrong.',
            buttons:[
              {
                text: '<b>Ok</b>',
                type: 'pink-white-theme-color'
              }
            ]
          });
        }       

    });

  };
  
})
.controller('SignInCtrl', function($scope, $timeout, $ionicLoading, $ionicPopup, $state, $http, LoginService, $ionicHistory, $cordovaGeolocation, $window, ContactService) {

    $scope.signIn = function(user) {

      // SETUP THE LOADER

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      // console.log('Sign-In', user);

      if (localStorage.getItem("deviceId") === null) {
        user.deviceId = '';
      }else{
        $scope.deviceId = JSON.parse(window.localStorage['deviceId']);
        user.deviceId = $scope.deviceId.registrationId;
        // var deviceId = { "registrationId": "fkrNU4iCah8:APA91bGMPeXSjYK8Gr-w5ETRtjDGqZmUAQEiLafCFuVaL1-lMitmjkr2cQw_yMyn-UUjxxQFfgLhYjbOUeVmDFFqXlQoeHewACo8JqQsCnIrodQVt_34HqADksrQSxcuF7ou2MrC_pkz" }
        // user.deviceId = deviceId.registrationId;
      }


      var posOptions = {timeout: 10000, enableHighAccuracy: false};
  
      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {      
        user.latitude  = position.coords.latitude;
        user.longitude = position.coords.longitude;

        // Getting location from lat long
        var promise = LoginService.getLocationByLatLong(user.latitude, user.longitude);
        promise.then(function(payload) {
            var userLocationData = payload.data;
            $scope.userLocation = userLocationData.results[1].formatted_address;
            user.user_location = $scope.userLocation;
            $scope.signinLastStep(user);
            // console.log($scope.userLocation)
        });
        
      }, function(err) {        
        $scope.signinLastStep(user);
      });


      // HITTING LOGIN SERVICE
      $scope.signinLastStep = function(user) {

        LoginService.loginUser(user).success(

          function(data) {            
            
            console.log(data);

            $ionicLoading.hide();
              
            if (data.code == 200) {
              
              var userData = JSON.parse(window.localStorage['userData'] || '{}');
            
              console.log('userData.username: ' + userData.username);
              console.log('userData.usertype:' + userData.usertype);

              // $state.go('app.deals');
              $ionicHistory.clearCache().then(function(){ $state.go('app.deals') });

            } else if(data.code == 102){  

                var confirmPopup = $ionicPopup.alert({
                  title: 'Login failed!',
                  template: 'Your account is inactive. Kindly contact the admin for account renewal.',
                  buttons:[
                    { text: 'Cancel' },
                    {
                      text: '<b>Ok</b>',
                      type: 'pink-white-theme-color',
                      onTap: function(e) {
                        // console.log('You are sure');
                        $state.go('contactAdmin');
                      }
                    }
                  ]
                });
                
                // krishanp@smartdatainc.net

            }else {
                var alertPopup = $ionicPopup.alert({
                    title:    'Login failed!',
                    template: 'Please check your credentials!',
                    buttons:[
                      {
                        text: '<b>Ok</b>',
                        type: 'pink-white-theme-color'
                      }
                    ]
                });
            }

        });
      }
  }

  $scope.contact = function(user) {
    ContactService.contactAdmin(user).success(function(data){
      if (data.code == 200) {
        var alertPopup = $ionicPopup.alert({
          title:    'Message Sent Successfully',
          template: 'Your message has been sent successfully. Our team will revert back you soon.',
          buttons:[
            {
              text: '<b>Ok</b>',
              type: 'pink-white-theme-color'
            }
          ]
        });
        $state.go('landing');

      } else {
        var alertPopup = $ionicPopup.alert({
          title:    'Error!',
          template: 'Sorry for the inconvenience. Please try again later.',
          buttons:[
            {
              text: '<b>Ok</b>',
              type: 'pink-white-theme-color'
            }
          ]
        });
      }
    });
  };
  
  $scope.gotoLogin = function() {
    console.log('Sign-In');
    $state.go('landing');
  };
})
.controller('RegisterCtrl', function($scope, $state, $ionicLoading, RegisterService, $ionicPopup, $cordovaGeolocation) {

  $scope.gotoLogin = function() {
    console.log('Sign-In');
    $state.go('landing');
  };
  

  $scope.signup = function(user) {
    
    // SETUP THE LOADER

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    
    // user.profilePic = BASE64IMAGE;
    var imageArr = document.getElementById("dealImage").value.split("base64")
    user.profilePic = imageArr[1];
    
    // user.profilePic = $scope.picData;

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
  
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {      
        user.latitude  = position.coords.latitude;
        user.longitude = position.coords.longitude;
        $scope.signupLastStep(user);
      }, function(err) {
        user.latitude  = 0;
        user.longitude = 0;
        $scope.signupLastStep(user);
      });
  }


  // HITTING SIGNUP SERVICE

  $scope.signupLastStep = function(user) {

    RegisterService.registerUser(user).success(function(data){
        
        console.log(data);

        $ionicLoading.hide();
        
        if (data.code == 200) {

            var alertPopup = $ionicPopup.alert({
                title:    'Registered Successfully!',
                template: 'Your credentials has been mailed. You may log in now.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

            $state.go('landing');

        } else if(data.error.code == 11000){                
            var alertPopup = $ionicPopup.alert({
                title:    'Registeration failed!',
                template: 'Email already exists. Please try with different one.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
        } else {                
            var alertPopup = $ionicPopup.alert({
                title:    'Registeration failed!',
                template: 'Oop\'s! something went wrong.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
        }       

    });
  }


  // UPLOAD USER's PROFILE PIC

  $scope.takePic = function() {
    var options =   {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, // FILE_URI, DATA_URL
        sourceType: 0,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
        encodingType: 0     // 0=JPG 1=PNG
    }
    navigator.camera.getPicture($scope.onSuccess,$scope.onFail,options);
  }

  $scope.onSuccess = function(DATA_URL) {
    $scope.picData = "data:image/jpeg;base64," + DATA_URL;
    var image = document.getElementById('myImage2');
    image.src = "data:image/jpeg;base64," + DATA_URL;
    image.style.display = "block";
    document.getElementById('uploadProfilePicButton').style.display = "none";
  };

  $scope.onFail = function(e) {
    console.log("On fail " + e);
  }

})
.controller('ForgotCtrl', function($scope, $state, $ionicLoading, $ionicPopup, ForgotService) {

  $scope.gotoLogin = function() {
    console.log('Sign-In');
    $state.go('landing');
  };

  $scope.forgotPassword = function(user) {

        // Setup the loader
      
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        console.log('Sign-In', user);

        // Hitting Forgot password Service

        ForgotService.forgotUser(user.email).success(

          function(data) {            
            
            console.log(data);

            $ionicLoading.hide();
              
            if (data.code == 200) {

                var alertPopup = $ionicPopup.alert({
                    title:    'Password Recovered Successfully',
                    template: 'Please check your Email for new password.',
                    buttons:[
                      {
                        text: '<b>Ok</b>',
                        type: 'pink-white-theme-color'
                      }
                    ]
                });

                $state.go('landing');

            } else {                
                var alertPopup = $ionicPopup.alert({
                    title:    'Invalid Email!',
                    template: 'Please check your Email you might have mistyped!',
                    buttons:[
                      {
                        text: '<b>Ok</b>',
                        type: 'pink-white-theme-color'
                      }
                    ]
                });
            }           

        });

    }

})
.controller('LocalDealsCtrl', function($scope, $state, $location, DealService, $ionicLoading, $ionicPopup, $cordovaSocialSharing, $ionicModal, $stateParams, SharingService, $ionicPopover) {
  console.log('LocalDealsCtrl')
})
.controller('DealsCtrl', function($scope, $state, $location, DealService, $ionicLoading, $ionicPopup, $cordovaSocialSharing, $ionicModal, $stateParams, SharingService, $ionicPopover) {

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.dealImagePath = DEAL_IMAGE;
  
  if (localStorage.getItem("userData") === null) {
    // console.log('ITS NULL');
    $state.go('landing');
  }else{

    $scope.userData = JSON.parse(window.localStorage['userData']);
    $scope.session_id = $scope.userData.session_id;
    
    DealService.findAllDealCategories().then(function (categories) {
      $scope.dealMenuCategories = categories.data.data;
    });
    DealService.findAllBusinessAddr($scope.userData.session_id).then(function (address) {
      $scope.businessAddress = address.data.data;
    });
  }
 
  console.log($stateParams.sortType);
  if ($stateParams.sortType == 'latest') {
    DealService.findLatestDeals().then(function (deals) {
      $scope.deals = deals.data.data;
      $ionicLoading.hide();
    });
  }else if ($stateParams.sortType == 'popular') {
    DealService.findPopularDeals().then(function (deals) {
      $scope.deals = deals.data.data;
      $ionicLoading.hide();
    });
  }else if ($stateParams.sortType == 'favorite') {
    DealService.findFavoriteDeals().then(function (deals) {
      $scope.deals = deals.data.data;
      $ionicLoading.hide();
    });
  }else if ($stateParams.sortType == 'by-price-low-high') {
    var sort_type = '1';
    DealService.findLowToHighPriceDeals(sort_type).then(function (deals) {
      $scope.deals = deals.data.data;
      $ionicLoading.hide();
    });
  }else if ($stateParams.sortType == 'by-price-high-low') {
    var sort_type = '-1';
    DealService.findHighToLowPriceDeals(sort_type).then(function (deals) {
      $scope.deals = deals.data.data;
      $ionicLoading.hide();
    });
  }else{
    DealService.findAllDeals().then(function (deals) {
      $scope.deals = deals.data.data;
      $ionicLoading.hide();
    });
  };
  
  DealService.findAllBusinessAddrLatLong().then(function (deals) {
    $scope.dealsLatLong = deals.data;
  });
  
  
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });


  /************** DEAL SHARING ***********/  


  $scope.share_web = function(dealId, deal_owner, shareVia, message, subject, file, link){
    var alertPopup = $ionicPopup.alert({
        title:    'Sharing alert!',
        template: 'Sharing not possible on web view.',
        buttons:[
          {
            text: '<b>Ok</b>',
            type: 'pink-white-theme-color'
          }
        ]
    });
  }

  $scope.share = function(dealId, deal_owner, shareVia, message, subject, file, link){
    
    var image = '';
    // console.log('hey ' + shareVia);
    
    if( shareVia == 'fb' ){
      
      $cordovaSocialSharing
        .shareViaFacebook(message, image, link)
        .then(function(result) {
          var alertPopup = $ionicPopup.alert({
                title:    'Deal Shared Successfully!',
                template: 'Your deal has been Successfully shared.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
          SharingService.addShare(dealId, $scope.session_id, deal_owner, 'facebook');
          $scope.modal.hide();
        }, function(err) {
          var alertPopup = $ionicPopup.alert({
                title:    'Error in sharing!',
                template: 'No Facebook app found in this device.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
          $scope.modal.hide();
        });
    }else if( shareVia == 'tw' ){
      $cordovaSocialSharing
        .shareViaTwitter(message, image, link)
        .then(function(result) {
            var alertPopup = $ionicPopup.alert({
                title:    'Deal Shared Successfully!',
                template: 'Your deal has been Successfully shared.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
            SharingService.addShare(dealId, $scope.session_id, deal_owner, 'twitter');
            $scope.modal.hide();
        }, function(err) {
          var alertPopup = $ionicPopup.alert({
                title:    'Error in sharing!',
                template: 'No Twitter app found in this device.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
          $scope.modal.hide();
        });
    }else if( shareVia == 'gp' ){
      window.plugins.socialsharing.shareVia('com.google.android.apps.plus', message, null, null, null,  function(){
            var alertPopup = $ionicPopup.alert({
                title:    'Deal Shared Successfully!',
                template: 'Your deal has been Successfully shared. '+result,
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
            $scope.modal.hide();            
            SharingService.addShare(dealId, $scope.session_id, deal_owner, 'google+');
          }, function(msg) {
            var alertPopup = $ionicPopup.alert({
                title:    'Error in sharing!',
                template: 'No Google+ app found in this device. '+err,
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
        $scope.modal.hide();
      });
    }else if( shareVia == 'all' ){
      $cordovaSocialSharing
      .share(message, subject, file, link) // Share via native share sheet
      .then(function(result) {
        var alertPopup = $ionicPopup.alert({
                title:    'Deal Shared Successfully!',
                template: 'Your deal has been Successfully shared.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
        SharingService.addShare(dealId, $scope.session_id, deal_owner._id, 'all');
        $scope.modal.hide();
      }, function(err) {
        var alertPopup = $ionicPopup.alert({
                title:    'Error in sharing!',
                template: 'Sorry for the interuption but their is no sharable app in your device.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
        $scope.modal.hide();
      });
    }
    
  };

  // Create the business modal that we will use later
  $ionicModal.fromTemplateUrl('templates/deals/share-deal.html', {
    id: '1', // We need to use and ID to identify the modal that is firing the event!
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the business modal to close it
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // Open the Business modal
  $scope.shareDeal = function(dealId, deal_owner, type, message, subject, file, link) {
    $scope.shareDealId      = dealId;
    $scope.shareDealOwner   = deal_owner;
    $scope.shareDealmessage = message;
    $scope.shareDealsubject = subject;
    $scope.shareDealfile    = file;
    $scope.shareDeallink    = link;
    $scope.modal.show();
  };

  // Listen for broadcasted messages
  $scope.$on('modal.shown', function(event, modal) {
    // console.log('Modal ' + modal.id + ' is shown!');
  });

  $scope.$on('modal.hidden', function(event, modal) {
    // console.log('Modal ' + modal.id + ' is hidden!');
  });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    console.log('Destroying modals...');
    $scope.modal.remove();
  });



  /*************** VIEW SINGLE DEAL ***************/
  
  $scope.view = function(dealId){
    $location.path( "app/single-deal/"+dealId );
  };



  /*************** INFINITE SCROLL STARTS ***************/

  $scope.loadMore = function(){
    var pushDeal = {
          0 : {
            deal_name : 'deal name test',
            biz_address : 'test addr',
            deal_price : 'test deal_price',
            deal_short_desc : 'test deal_short_desc'},
          1 : {
            deal_name : 'deal name test',
            biz_address : 'test addr',
            deal_price : 'test deal_price',
            deal_short_desc : 'test deal_short_desc'}

          };
    // console.log('Load More');
    DealService.findAllDeals().then(function (deals) {
      // $scope.deals = newDeals.data;
      // $scope.deals.push('pushDeal');
      // $scope.deals.push(deals.data);
      // console.log(deals.data);
      // console.log(pushDeal);
      // $scope.$broadcast('scroll.infiniteScrollComplete');
    });

    // $http.get('/more-items').success(function(items) {
    //   useItems(items);
    //   $scope.$broadcast('scroll.infiniteScrollComplete');
    // });

  };
  


  /*************** CREATE DEAL ***************/

  $scope.createDeal = function(deal) {
    
    // SETUP THE LOADER

    console.log(deal);

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    
    $scope.userData = JSON.parse(window.localStorage['userData']);
    
    if (deal.newBizAddr == undefined) { deal.newBizAddr = '' };
    if (deal.bizAddrId  == undefined) { deal.bizAddrId ='0' };
    if (deal.favourite  == undefined) { deal.favourite ='0' };    
    if (deal.favourite  == true) { deal.favourite ='1' };
    if (deal.deal_video) {
      console.log(deal.deal_video);
      var str = deal.deal_video;
      video_arr = str.split("=");  
      deal.deal_video = 'http://www.youtube.com/embed/'+video_arr[1];
    };
    

    // deal.dealImageData  = BASE64IMAGE;
    // deal.dealIconData   = BASE64IMAGE;
    var imageArr = document.getElementById("dealImage").value.split("base64")
    deal.dealImageData = imageArr[1];
    var imageArrIcon = document.getElementById("dealIcon").value.split("base64")
    deal.dealIconData = imageArrIcon[1];
    // deal.dealIconData  = $scope.dealIconData;
    deal.dealOwner     = $scope.userData.session_id;
   
    $scope.createDealLastStep(deal);
      
  }

  // HITTING CREATE DEAL SERVICE

  $scope.createDealLastStep = function(deal) {

    DealService.createDeal(deal).success(function(data){
        
        console.log(data);

        $ionicLoading.hide();
        
        if (data.code == 200) {

          if (data.balance_code == 200) {
            var alertPopup = $ionicPopup.alert({
                title:    'Deal Created Successfully!',
                template: 'Your deal has been Successfully created. You may now check it in your My Deals section.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

            $state.go('app.deals');

          }else if(data.balance_code == 105){
            var alertPopup = $ionicPopup.alert({
                title:    'Insufficient Funds!',
                template: 'Unable to create new deal because of Insufficient balance.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
            $state.go('app.buyCredits');
          }

        } else if(data.code == 101){

            var alertPopup = $ionicPopup.alert({
                title:    'Anonymous failed!',
                template: 'Oop\'s! it seems like something went wrong.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

        } else {       

            var alertPopup = $ionicPopup.alert({
                title:    'Anonymous failed!',
                template: 'Oop\'s! it seems like something went wrong.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

        }    

    });
  }

  /* GALLERY AND CAMERA OPTIONS FOR DEAL IMAGE UPLOAD */

  $scope.takePic = function() {
      var options =   {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: 0,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
          encodingType: 0     // 0=JPG 1=PNG
      }
      navigator.camera.getPicture($scope.onSuccess,$scope.onFail,options);
  }
  $scope.onSuccess = function(DATA_URL) {
    
      // $scope.dealImageData = "data:image/jpeg;base64," + DATA_URL;
      $scope.dealImageData = DATA_URL;
      var image = document.getElementById('dealImage');
      image.src = "data:image/jpeg;base64," + DATA_URL;
      image.style.display = "block";
      document.getElementById('padding-picture').style.display = "block";    
      // document.getElementById('uploadDealImageButton').style.display = "none";

  };
  $scope.onFail = function(e) {
      console.log("On fail " + e);
  }

  /* GALLERY AND CAMERA OPTIONS FOR DEAL ICON UPLOAD */

  $scope.takeIconPic = function() {
      var options =   {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: 0,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
          encodingType: 0     // 0=JPG 1=PNG
      }
      navigator.camera.getPicture($scope.onSuccessIcon,$scope.onFailIcon,options);
  }
  $scope.onSuccessIcon = function(DATA_URL) {
    
      // $scope.dealIconData = "data:image/jpeg;base64," + DATA_URL;
      $scope.dealIconData = DATA_URL;
      var image = document.getElementById('dealIcon');
      image.src = "data:image/jpeg;base64," + DATA_URL;
      image.style.display = "block";
      document.getElementById('padding-icon').style.display = "block";
      // document.getElementById('uploadDealIconButton').style.display = "none";

  };
  $scope.onFailIcon = function(e) {
      console.log("On fail " + e);
  }

  if ($stateParams.dealId) {
    DealService.findDealById($stateParams.dealId).then(function(deal) {
      $scope.deal   = deal.data.data;
      $scope.dealId = $stateParams.dealId;
      console.log($scope.deal);
    });
  };

})
.controller('DealDetailCtrl', function ($scope, $stateParams, DealService, $ionicModal, $ionicPopup, $cordovaSocialSharing, $ionicLoading, SharingService, $timeout, $sce) {
    
     
    $scope.$on('$ionicView.loaded', function(){
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    });
    $scope.$on('$ionicView.enter', function(){      
      $timeout(function () {
        $ionicLoading.hide();
      }, 2000);
    });

    if (localStorage.getItem("userData") === null) {      
      $state.go('landing');
    }else{
      $scope.userData = JSON.parse(window.localStorage['userData']);
      $scope.session_id = $scope.userData.session_id;      
      // console.log($scope.userData);
    }

    $scope.dealImagePath  = DEAL_IMAGE;
    $scope.dealIconPath   = DEAL_ICON;
    $scope.profilePicPath = PROFILE_PIC;

    DealService.findDealById($stateParams.dealId).then(function(deal) {
        $scope.deal   = deal.data.data;
        $scope.dealId = $stateParams.dealId;      
        // console.log($scope.deal);   
    });
    DealService.getDealRating($stateParams.dealId).then(function(rating) {
        $scope.dealRating   = rating.data;
        if($scope.dealRating.data.length <= 0 ){
          $scope.ratedstars = 0;
        }else{
          $scope.ratedstars = $scope.dealRating.data[0].avgRating;
        }
        $scope.maxrating = 5;        
        $scope.unratedstars = $scope.maxrating - $scope.ratedstars;
    });
    DealService.getDealReviews($stateParams.dealId).then(function(reviews) {
        $scope.dealReviews   = reviews.data.data;
        $scope.reviewsCount  = reviews.data.data.length;      
    });
    SharingService.getShares($stateParams.dealId).then(function(shares) {
        $scope.dealShares   = shares.data.data;
        $scope.sharesCount  = shares.data.data.length;
    });


    /* RATING SCOPES STARTS */

    // $scope.rating = 4;
    $scope.data = {
      rating : 1,
      max: 5
    }

    // Create the rating modal 
    $ionicModal.fromTemplateUrl('templates/deals/rate.html', {
      id: '1', 
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Create the reviews modal
    $ionicModal.fromTemplateUrl('templates/deals/review.html', {
      id: '2', 
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
    });

    // Triggered in the rating modal to close it
    $scope.closeLogin = function(index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
    };

    // Open the rating modal
    $scope.rate = function(index) {
      if (index == 1) $scope.oModal1.show();
      else $scope.oModal2.show();
    };

    $scope.$on('modal.shown', function(event, modal) {
      console.log('Modal ' + modal.id + ' is shown!');
    });

    $scope.$on('modal.hidden', function(event, modal) {
      console.log('Modal ' + modal.id + ' is hidden!');
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      console.log('Destroying modals...');
      $scope.oModal1.remove();
      $scope.oModal2.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });




  /************ FLAG THE DEAL ***********/

    $scope.flag = function(deal_id){

      DealService.flagDeal(deal_id, $scope.deal.deal_owner._id, $scope.session_id).success(function(data){
        
        console.log(data);
        
        if (data.code == 200) {

          var alertPopup = $ionicPopup.alert({
              title:    'Flagged Successfully!',
              template: 'This deal has been Flagged successfully.',
              buttons:[
                {
                  text: '<b>Ok</b>',
                  type: 'pink-white-theme-color'
                }
              ]
          });

          // $state.go('app.deals');

        } else {

          var alertPopup = $ionicPopup.alert({
              title:    'Anonymous failed!',
              template: 'Oop\'s! it seems like something went wrong.',
              buttons:[
                {
                  text: '<b>Ok</b>',
                  type: 'pink-white-theme-color'
                }
              ]
          });
        }

      });      
    };

  
  /************ SHARING DEAL ON SINGLE DEAL PAGE ***********/

  $scope.share_web = function(dealId, deal_owner, shareVia, message, subject, file, link){
    var alertPopup = $ionicPopup.alert({
        title:    'Sharing alert!',
        template: 'Sharing not possible on web view.',
        buttons:[
          {
            text: '<b>Ok</b>',
            type: 'pink-white-theme-color'
          }
        ]
    });
  }
  
  $scope.share = function(dealId, message, subject, file, link){

      $cordovaSocialSharing
      .share(message, subject, file, link) // Share via native share sheet
      .then(function(result) {
        var alertPopup = $ionicPopup.alert({
                title:    'Deal Shared Successfully!',
                template: 'Your deal has been Successfully shared.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

        SharingService.addShare($scope.dealId, $scope.session_id, $scope.deal.deal_owner._id, 'all');
        $scope.sharesCount +=1;
        $scope.modal.hide();
        
      }, function(err) {
        var alertPopup = $ionicPopup.alert({
                title:    'Error in sharing!',
                template: 'Sorry for the interuption but their is no sharable app in your device.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
        $scope.modal.hide();
      });
  };


  /************ SUBMIT REVIEW ON SINGLE DEAL PAGE ***********/

    $scope.submitReview = function(reviews){
      reviews.reviewby    = $scope.session_id ;
      reviews.deal_id     = $scope.dealId ;
      reviews.deal_owner  = $scope.deal.deal_owner._id ;
      DealService.postReviewsOnDeal(reviews).success(function(data){
        
        // console.log(data);

        $ionicLoading.hide();
        
        if (data.code == 200) {

          var alertPopup = $ionicPopup.alert({
              title:    'Review Posted Successfully!',
              template: 'Your review has been posted successfully. You may now check it in your My Reviews section.',
              buttons:[
                {
                  text: '<b>Ok</b>',
                  type: 'pink-white-theme-color'
                }
              ]
          });

          $scope.review = '';
          var pushDealReview = {
            reviewby : {
                        "photo": $scope.userData.profiledata.photo,
                        "first_name": $scope.userData.profiledata.first_name,
                        "last_name": $scope.userData.profiledata.last_name
                      },
            review : reviews.review

          };
          $scope.dealReviews.push(pushDealReview);
          $scope.reviewsCount +=1;
        } else {

          var alertPopup = $ionicPopup.alert({
              title:    'Anonymous failed!',
              template: 'Oop\'s! it seems like something went wrong.',
              buttons:[
                {
                  text: '<b>Ok</b>',
                  type: 'pink-white-theme-color'
                }
              ]
          });
        }

        $scope.oModal2.hide();

      });
    };


  /************ POSTING RATING ON SINGLE DEAL PAGE ***********/

    $scope.postRating = function(){
      var rating = {};
      rating.ratedby    = $scope.session_id ;
      rating.deal_id    = $scope.dealId ;
      rating.deal_owner = $scope.deal.deal_owner._id ;
      DealService.getDynamicRating().then(function (value) {
        rating.rating = value;
        // $scope.newRating = console.log('New rating valuekey: "value",  '+value);
        DealService.postRatingOnDeal(rating).success(function(data){
          
          console.log(data);

          $ionicLoading.hide();
          
          if (data.code == 200) {

            var alertPopup = $ionicPopup.alert({
                title:    'Rated Successfully!',
                template: 'Your rating has been posted successfully.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

            // $state.go('app.deals');

          } else {

            var alertPopup = $ionicPopup.alert({
                title:    'Anonymous failed!',
                template: 'Oop\'s! it seems like something went wrong.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
          }

        });
      });
    };  
    

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }
})
.controller('CatDealsCtrl', function($scope, $stateParams, DealService, $ionicLoading) {

  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

  $scope.catId    = $stateParams.catId;
  $scope.catName  = $stateParams.catName;
  DealService.findCatDeals($scope.catId).then(function (deals) {
    $scope.catDeals = deals.data.data;
    $ionicLoading.hide();
  });

})
.controller('MyDeals', function($scope, $stateParams, DealService, $ionicPopup, $location, $state, $ionicLoading) {

  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

  $scope.userData = JSON.parse(window.localStorage['userData']);
  DealService.findMyDeals($scope.userData.session_id).then(function (deals) {
    $scope.mydeals = deals.data.data;
    $ionicLoading.hide();
    // console.log($scope.mydeals);
  });

  /************ CHANGE DEAL STATUS DEAL ***********/

  $scope.changeDealStatus = function (id, deal_publish, publish_text) {

    DealService.publishUnpublishDeal(deal_publish, id, $scope.userData.session_id).then(function (data) {
      // console.log(data.data);
        if (data.data.code == 200) {

            var alertPopup = $ionicPopup.alert({
                title:    publish_text+' Successfully!',
                template: 'Your deal has been '+publish_text+' successfully.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

            $state.go($state.current, {}, {reload: true});

        } else {

          var alertPopup = $ionicPopup.alert({
              title:    'Anonymous failed!',
              template: 'Oop\'s! it seems like something went wrong.',
              buttons:[
                {
                  text: '<b>Ok</b>',
                  type: 'pink-white-theme-color'
                }
              ]
          });
        }

    });
  };

  /************ CLONE THE DEAL ***********/

  $scope.clone = function(deal_id){
    $location.path( "app/clone-deal/"+deal_id );      
  };

})
.controller('ReviewsCtrl', function($scope, $stateParams, ReviewsService, $ionicLoading, $ionicPopup) {
  
  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  $scope.userData = JSON.parse(window.localStorage['userData']);
  ReviewsService.findMyReveiws($scope.userData.session_id).then(function (reviews) {
    $scope.reviews = reviews.data.data;
    $ionicLoading.hide();
    // console.log( $scope.reviews );
  });

  $scope.deleteMyReveiw = function(review_id, $index){

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

    var status = 0;
    ReviewsService.updateMyReview(status, review_id).then(function (data) {
      console.log(data);
      $scope.reviews.splice($index, 1);
      $ionicLoading.hide();
      if (data.data.code == 200) {

           var alertPopup = $ionicPopup.alert({
                title:    'Deleted',
                template: 'Your review has been deleted successfully',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

        } else {        

            var alertPopup = $ionicPopup.alert({
                title:    'Error!',
                template: 'Sorry for the inconvenience. Please try again later.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
        }
    });
  }

})
.controller('CreditsCtrl', function($scope, $stateParams, CreditsService, $ionicLoading) {

  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

  $scope.userData = JSON.parse(window.localStorage['userData']);
  CreditsService.getCredits($scope.userData.session_id).then(function (credits) {
    $scope.credits = credits.data.data[0];
    $ionicLoading.hide();
  });
  CreditsService.getPackages().then(function (packages) {
    $scope.packages = packages.data.data;
    $ionicLoading.hide();
  });
})
.controller('BizCtrl', function($scope, $state, $window, $stateParams, DealService, $ionicModal, $ionicLoading, $ionicPopup, AddressService) {
  
  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  /* GETTING BIZ ADDRESS */
  $scope.userData = JSON.parse(window.localStorage['userData']);
  DealService.findAllBusinessAddr($scope.userData.session_id).then(function (address) {
    $scope.businessAddress = address.data.data;
    $ionicLoading.hide();
  });



  // Create the business modal that we will use later
  $ionicModal.fromTemplateUrl('templates/pages/create-biz-addr.html', {
    id: '1', // We need to use and ID to identify the modal that is firing the event!
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the business modal to close it
  $scope.closeModal = function(index) {
    $scope.modal.hide();
  };

  // Open the Business modal
  $scope.createBizAddrModal = function(index) {
    $scope.modal.show();
  };

  // Listen for broadcasted messages
  $scope.$on('modal.shown', function(event, modal) {
    console.log('Modal ' + modal.id + ' is shown!');
  });

  $scope.$on('modal.hidden', function(event, modal) {
    console.log('Modal ' + modal.id + ' is hidden!');
  });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    console.log('Destroying modals...');
    $scope.modal.remove();
  });

  /*************** CREATE BIZ ADDRESS  *************/

  $scope.createBizAddr = function(address) {
    $scope.modal.hide();
    console.log(address);

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    // Getting location from lat long
    var promise = AddressService.getLatLongByLocation(address.biz_address);
    promise.then(function(payload) {
        var userLocationData  = payload.data;
        address.biz_lat   = userLocationData.results[0].geometry.location.lat;
        address.biz_long  = userLocationData.results[0].geometry.location.lng;
        address.biz_owner = $scope.userData.session_id;    
        $scope.saveAddrLastStep(address);

        // console.log(address.biz_lat +','+ address.biz_long)
    });
    

    $scope.saveAddrLastStep = function(){
      AddressService.addAddress(address).success(function(data){
          
          console.log(data);

          $ionicLoading.hide();        
          
          if (data.code == 200) {
            var alertPopup = $ionicPopup.alert({
                title:    'Address Added Successfully!',
                template: 'Your Address has been added Successfully.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
            alertPopup.then(function(res) {
              // $window.location.reload(true);
            });

            var pushBizAddr = {
              _id : data.data._id,
              biz_address : address.biz_address
            };
            $scope.businessAddress.push(pushBizAddr);

          } else {
            var alertPopup = $ionicPopup.alert({
                title:    'Failed!',
                template: 'Oop\'s! it seems like something went wrong.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
          }
      });
    }

  };


  /*************** DELETE BIZ ADDRESS  *************/

  $scope.deleteBizAddr = function(id, $index) {
    console.log(id);

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    var address = {
      biz_id : id,
      biz_status : '0'
    };
    AddressService.deleteAddress(address).success(function(data){
        
        $scope.businessAddress.splice($index, 1);  
        $ionicLoading.hide();       
        
          if (data.code == 200) {
            var alertPopup = $ionicPopup.alert({
                title:    'Address Deleted Successfully!',
                template: 'Your Address has been deleted Successfully.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });

          } else {
            var alertPopup = $ionicPopup.alert({
                title:    'Failed!',
                template: 'Oop\'s! it seems like something went wrong.',
                buttons:[
                  {
                    text: '<b>Ok</b>',
                    type: 'pink-white-theme-color'
                  }
                ]
            });
          }

    });

  };
 
});



/************************ APP FILTERS *********************/


angular.module('deals.controllers')
.filter('time', function($filter)
  {
   return function(input)
   {
    if(input == null){ return ""; } 
   
    var _date = $filter('date')(new Date(input), 'MMMM d, y');
   
    return _date.toUpperCase();
   };
  })
.filter('ratingstar', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});


/************************ APP DIRECTIVES *********************/


angular.module('deals.controllers')
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
      attrs.$observe('ngSrc', function(value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});


/************************ APP OTHER METHODS *********************/


angular.module('ionic.rating', [])
.constant('ratingConfig', {
    max: 5,
    stateOn: null,
    stateOff: null
  })
.controller('RatingController', function($scope, $attrs, ratingConfig, DealService) {
    var ngModelCtrl;
    ngModelCtrl = {
      $setViewValue: angular.noop
    };
    this.init = function(ngModelCtrl_) {
      var max, ratingStates;
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;
      this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
      this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
      max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max;
      ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) : new Array(max);
      return $scope.range = this.buildTemplateObjects(ratingStates);
    };
    this.buildTemplateObjects = function(states) {
      var i, j, len, ref;
      ref = states.length;
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        states[i] = angular.extend({
          index: 1
        }, {
          stateOn: this.stateOn,
          stateOff: this.stateOff
        }, states[i]);
      }
      return states;
    };
    $scope.rate = function(value) {

      DealService.setDynamicRating(value).then(function () {
        console.log('New rating valuekey: "value",  '+value);
      });

      console.log('rate me! '+value);
      if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
        ngModelCtrl.$setViewValue(value);
        return ngModelCtrl.$render();
      }
    };
    $scope.reset = function() {
      $scope.value = ngModelCtrl.$viewValue;
      return $scope.onLeave();
    };
    $scope.enter = function(value) {
      if (!$scope.readonly) {
        $scope.value = value;
      }
      return $scope.onHover({
        value: value
      });
    };
    $scope.onKeydown = function(evt) {
      if (/(37|38|39|40)/.test(evt.which)) {
        evt.preventDefault();
        evt.stopPropagation();
        return $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? {
          1: -1
        } : void 0));
      }
    };
    this.render = function() {
      return $scope.value = ngModelCtrl.$viewValue;
    };
    return this;
  })
.directive('rating', function() {
    return {
      restrict: 'EA',
      require: ['rating', 'ngModel'],
      scope: {
        readonly: '=?',
        onHover: '&',
        onLeave: '&'
      },
      controller: 'RatingController',
      template: '<ul class="rating" ng-mouseleave="reset()" ng-keydown="onKeydown($event)">' + '<li ng-repeat="r in range track by $index" ng-click="rate($index + 1)"><i class="icon" ng-class="$index < value && (r.stateOn || \'ion-ios-star\') || (r.stateOff || \'ion-ios-star-outline\')"></i></li>' + '</ul>',
      replace: true,
      link: function(scope, element, attrs, ctrls) {
        var ngModelCtrl, ratingCtrl;
        ratingCtrl = ctrls[0];
        ngModelCtrl = ctrls[1];
        if (ngModelCtrl) {
          return ratingCtrl.init(ngModelCtrl);
        }
      }
    };
})
.directive('onlyrating', function() {
    return {
      restrict: 'EA',
      require: ['onlyrating', 'ngModel'],
      scope: {
        readonly: '=?',
        onHover: '&',
        onLeave: '&'
      },
      controller: 'RatingController',
      template: '<ul class="rating onlyrating" ng-mouseleave="reset()" ng-keydown="onKeydown($event)">' + '<li ng-repeat="r in range track by $index"><i class="icon" ng-class="$index < value && (r.stateOn || \'ion-ios-star\') || (r.stateOff || \'ion-ios-star-outline\')"></i></li>' + '</ul>',
      replace: true,
      link: function(scope, element, attrs, ctrls) {
        var ngModelCtrl, ratingCtrl;
        ratingCtrl = ctrls[0];
        ngModelCtrl = ctrls[1];
        if (ngModelCtrl) {
          return ratingCtrl.init(ngModelCtrl);
        }
      }
    };
});




function encodeImageFileAsURL(){
  var filesSelected = document.getElementById("inputFileToLoad").files;
  if (filesSelected.length > 0)
  {
    var fileToLoad = filesSelected[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
    var srcData = fileLoadedEvent.target.result; // <--- data: base64
    var newImage = document.createElement('img');
    newImage.src = srcData;
    document.getElementById("imgTest").innerHTML   = newImage.outerHTML;
    document.getElementById("dealImage").value = srcData;
    //alert("Converted Base64 version is "+document.getElementById("imgTest").innerHTML);
    //console.log("Converted Base64 version is "+document.getElementById("imgTest").innerHTML);
    }
    fileReader.readAsDataURL(fileToLoad);
  }
}

function encodeIconFileAsURL(){
  var filesSelected = document.getElementById("inputIconToLoad").files;
  if (filesSelected.length > 0)
  {
    var fileToLoad = filesSelected[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
    var srcData = fileLoadedEvent.target.result; // <--- data: base64
    var newImage = document.createElement('img');
    newImage.src = srcData;
    document.getElementById("imgTestIcon").innerHTML   = newImage.outerHTML;
    document.getElementById("dealIcon").value = srcData;
    //alert("Converted Base64 version is "+document.getElementById("imgTest").innerHTML);
    //console.log("Converted Base64 version is "+document.getElementById("imgTest").innerHTML);
    }
    fileReader.readAsDataURL(fileToLoad);
  }
}