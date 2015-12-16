angular.module('starter.controllers', [])
  .controller('AppCtrl', function($state,$scope,$http,$q,$cookies,$rootScope) {})
  .controller('authCtrl', function($scope,$http,$ionicModal, $timeout,$state, $location,$cookies,$rootScope, Flash) {
    localStorage.setItem("apiurl", "http://localhost:8987");
    $rootScope.appUrl = 'http://localhost:8987';
    // Form data for the login modal
    var flag = false;
    var logout = false;
    if (typeof $state.current.flag !== 'undefined') {
      flag = $state.current.flag;
    }
    if(typeof $rootScope.appUrl === 'undefined'){
      $rootScope.appUrl = localStorage.getItem("apiurl");
    }
    if (logout == true) {
      var request = {
        method: 'GET',
        url: localStorage.getItem("apiurl")+'/front_patient/loggedout',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        //data: 'username=' + postData.username + '&password=' + postData.password
      };
      $http(request).then(function(response){
        if (response.data.success == true) {
          $cookies.remove('user_id');
          $rootScope.user = {};
          $state.go('login');
        } else{
          $location.path('app/questionnaire');
          // $state.go('app.questionnaire');
        }
      })
    }
    $scope.loginData = {};
    $scope.sign_in = function(){
      var postData = {};
      postData.username = $scope.loginData.username;
      postData.password = $scope.loginData.password;
      var request = {
        method: 'POST',
        url: localStorage.getItem("apiurl")+'/front_patient/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'username=' + postData.username + '&password=' + postData.password
      };
      $http(request).then(function(response){
        console.log(response.data);
        if (!response.data.error) {
          //if ($scope.remember === true){
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);
            $cookies.put('user_id', response.data.user_id, {'expires': expireDate});
            $cookies.put('password', response.data.password, {'expires': expireDate});
          //}
          $state.go('app.questionnaire');
        } else {
          $scope.error_message = response.data.message;
        }
      })
    }
  })
  .controller('PatientCtrl', function($state,$scope,$http,$q,$cookies,$rootScope) {
    if(typeof $rootScope.appUrl === 'undefined'){
      $rootScope.appUrl = localStorage.getItem("apiurl");
    }
    var flag = false;
    if (typeof $state.current.flag !== 'undefined') {
      flag = $state.current.flag;
    }
    $scope.getDetails = function(){
      console.log('HERE');
    }
    if(flag == 'profile'){
      $scope.getDetails();
    }
  })
  .controller('NotificationCtrl', function($state,$scope,$http,$q,$cookies,$rootScope,$ionicPopup, $timeout,moment) {
    console.log($rootScope.appUrl);
    if(typeof $rootScope.appUrl === 'undefined'){
      $rootScope.appUrl = localStorage.getItem("apiurl");
    }
    var flag = false;
    if (typeof $state.current.flag !== 'undefined') {
      flag = $state.current.flag;
    }
    
    $scope.changePassword = function(){
        if(typeof $rootScope.appUrl === 'undefined'){
          $rootScope.appUrl = localStorage.getItem("apiurl");
        }
        var postData = {}; $scope.cpData = {};
        postData.patient   = $cookies.get('user_id');
        postData.password  = $cookies.get('password');
        
        // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: "<div class='col'><div class='list'><label class='item item-input'><input type='password' name='oldpassword' value='' ng-model='cpData.oldpassword' placeholder='Old Password' ngMinlength=6 /></label></div><div class='list'><label class='item item-input'><input type='password' name='newpassword' value='' placeholder='New Password' ng-model='cpData.newpassword' /></label></div><div class='list'><label class='item item-input'><input type='password' name='confirmpassword' value='' ng-model='cpData.confirmpassword' placeholder='Confirm Password' /></label></div></div>",
            title: 'Change Password',
            scope: $scope,
            buttons: [
              { text: 'Cancel',type: 'button-small' },
              {
                text: 'Save',
                type: 'button button-dark button-small',
                onTap: function(e) {
                  //if(!$scope.cpData.oldpassword) {
                  //  //don't allow the user to close unless he enters wifi password
                  //  e.preventDefault();
                  //  alert('Old password is required');
                  //}else if(!$scope.cpData.newpassword) {
                  //  e.preventDefault();
                  //  alert('New password is required');
                  //}else if(!$scope.cpData.confirmpassword) {
                  //  e.preventDefault();
                  //  alert('Confirm password is required');
                  //}
                  //else{
                  if($scope.cpData.oldpassword && $scope.cpData.newpassword && $scope.cpData.confirmpassword) {
                    alert(1); return;
                      postData._id = $cookies.get('user_id');
                      postData.password = $scope.cpData.newpassword;

                      var request = {
                        method: 'POST',
                        data: '_id=' + postData._id + '&password=' + postData.password,
                        url: $rootScope.appUrl+'/patient/updatepassword',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        }
                      };
                      $http(request).then(function(response){
                        console.log('response = ',response.data);
                        //if (!response.data.error) {
                        //  $scope.questionnaires = response.data;
                        //} else{
                        //  $scope.error_message = response.data.message;
                        //}
                      })
                  }else{
                    alert(0); return;
                  }
                  //}
                }
              }
            ]
          });
          myPopup.then(function(res) {
            console.log('Tapped!', res);
          });
          //$timeout(function() {
          //   myPopup.close(); //close the popup after 3 seconds for some reason
          //}, 3000);
        
        /*
        var request = {
          method: 'POST',
          url: $rootScope.appUrl+'/front_patient/saveans',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'postData=' + JSON.stringify(postData)
        };
        $http(request).then(function(response){
          // console.log(response.data);
          if(response.data.success){
            // $scope.error_message = 'Questions Saved Successfully.';
            Flash.create('success', 'Questions Saved Successfully.', 'alert alert-success');
            $state.go('app.questionnaire');
          }else{
            $scope.error_message = response.data.message;
          }
        })
        */
    }
    
    $scope.notifications = function(){
      var postData = {};
      postData.patient_id = $cookies.get('user_id');
      postData.is_filled = 0;
      var request = {
        method: 'POST',
        data: 'pId=' + postData.patient_id + '&isFilled=' + postData.is_filled,
        url: $rootScope.appUrl+'/notification',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      $http(request).then(function(response){
        if (!response.data.error) {
          $scope.questionnaires = response.data;
          for (var i = 0; i < response.data.length; i++) {
                $scope.questionnaires[i].ntime   = moment.unix(response.data[i].datetime).format('HH:mm');
                $scope.questionnaires[i].ndate   = moment.unix(response.data[i].datetime).format('MM/DD/YYYY');
          }
          console.log($scope.questionnaires);
        } else{
          $scope.error_message = response.data.message;
        }
      })
    }
    
    
    if(flag == 'Notifications'){
      $scope.notifications();
    }
  })
  .controller('QuestionsCtrl', function($scope,$stateParams,$http,$q,$state,$cookies,$rootScope, Flash) {
    var flag = false;
    if (typeof $state.current.flag !== 'undefined') {
      flag = $state.current.flag;
    }
    if(typeof $rootScope.appUrl === 'undefined'){
      $rootScope.appUrl = localStorage.getItem("apiurl");
    }
    var postData = {};
    $scope.questions = function(){
      var DEFAULT_PAGE_SIZE_STEP = 3;
      $scope.currentPage = 1;
      $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP; 
      $scope.answerModel = {};
      $scope.loadNextPage = function(){
        $scope.currentPage++;
        $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
      }
      var postData = {};
      postData.questionnaire = $stateParams.id;
      postData.patient_id = $cookies.get('user_id');
      postData.is_filled = 0;
      var request = {
        method: 'POST',
        data: 'pId=' + postData.patient_id + '&isFilled=' + postData.is_filled + '&_id=' + postData.questionnaire,
        url: $rootScope.appUrl+'/questionnaire/getList',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      $http(request).then(function(response){
        if (!response.data.error) {
          $scope.questionnaires = response.data;
        } else{
          $scope.error_message = response.data.message;
        }
      })
    }
    var notification_id = $stateParams.id;
    $scope.notification_id = notification_id;
    /* get questionid fron notification_id */
    var request = {
      method: 'POST',
      url: $rootScope.appUrl+'/notification/getQuestionnaire',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: '_id=' + notification_id
    };
    $http(request).then(function(res){
      if(res.data.questionnaire){
        postData.questionnaire = res.data.questionnaire;
        postData.patient_id = $cookies.get('user_id');
        postData.is_filled = 0;
        $scope.questionnaire = postData.questionnaire;
        var request = {
          method: 'POST',
          data: 'pId=' + postData.patient_id + '&isFilled=' + postData.is_filled + '&_id=' + postData.questionnaire,
          url: $rootScope.appUrl+'/questionnaire/getList',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
        $http(request).then(function(response){
          console.log(response.data);
          if (!response.data.error) {
            $scope.questionnaires = response.data;
          } else{
            $scope.error_message = response.data.message;
          }
        })
        // $state.go('app.questionnaire');
      }else{
        $scope.error_message = 'Notification Unavailable.';
      }
    })
    $scope.quesData = {}; $scope.ansData = {};
    $scope.ques_save = function(){
      //$rootScope.appUrl = 'http://localhost:8987';
      if(typeof $rootScope.appUrl === 'undefined'){
        $rootScope.appUrl = localStorage.getItem("apiurl");
      }
      var postData = {}; 
      postData.patient          = $cookies.get('user_id');
      postData.notification_id  = $stateParams.id;
      postData.questionnaire    = $scope.questionnaire;
      postData.quesData         = $scope.quesData;
      postData.ansData          = $scope.ansData;
      var request = {
        method: 'POST',
        url: $rootScope.appUrl+'/front_patient/saveans',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'postData=' + JSON.stringify(postData)
      };
      $http(request).then(function(response){
        // console.log(response.data);
        if(response.data.success){
          // $scope.error_message = 'Questions Saved Successfully.';
          Flash.create('success', 'Questions Saved Successfully.', 'alert alert-success');
          $state.go('app.questionnaire');
        }else{
          $scope.error_message = response.data.message;
        }
      })
    }
    if(flag=='questions'){
      $scope.questions();
    }
  })
  ;