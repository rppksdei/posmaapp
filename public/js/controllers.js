angular.module('starter.controllers', [])
  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // Form data for the login modal
  })
  .controller('authCtrl', function($scope,$http,$q, $ionicModal, $timeout,$state, $location,$cookies,$rootScope) {
    // Form data for the login modal
    var logout = false;
    /* if (typeof $route.current.$$route.logout !== 'undefined') {
      logout = $route.current.$$route.logout;
    } */
    //$rootScope.testvar = 'RAMAN';
    $rootScope.appUrl = 'http://localhost:8987';
    console.log($rootScope.appUrl,'--------');
    if (logout == true) {
      var request = {
        method: 'GET',
        url: $rootScope.appUrl+'/front_patient/loggedout',
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
        url: $rootScope.appUrl+'/front_patient/login',
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
          //}
          $state.go('app.questionnaire');
        } else {
          $scope.error_message = response.data.message;
        }
      })
    }
  })
  .controller('NotificationCtrl', function($scope,$http,$q,$cookies,$rootScope) {
    $rootScope.appUrl = 'http://localhost:8987';
    var flag = '';
    //$scope.list = function(){
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
      //console.log(response.data);
      if (!response.data.error) {
        $scope.questionnaires = response.data;
      } else{
        $scope.error_message = response.data.message;
      }
    })
  })
  .controller('QuestionsCtrl', function($scope,$stateParams,$http,$q,$state,$cookies,$rootScope) {
    var flag = '';
    $rootScope.appUrl = 'http://localhost:8987';
    var postData = {};
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
      //console.log(response.data);
      if (!response.data.error) {
        $scope.questionnaires = response.data;
      } else{
        $scope.error_message = response.data.message;
      }
    })

    $scope.quesData = {}; $scope.ansData = {};
    $scope.ques_save = function(){
      var postData = {}; 
      console.log($scope.quesData);
      console.log($scope.ansData);
      postData.patient        = $cookies.get('user_id');
      postData.questionnaire  = $stateParams.id;
      postData.quesData       = $scope.quesData;
      postData.ansData        = $scope.ansData;
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
        if (response.data.success) {
          $state.go('app.questionnaire');
        }else{
          $scope.error_message = response.data.message;
        }
        // if (!response.data.error) {
        //     if ($scope.remember === true){
        //         var expireDate = new Date();
        //         expireDate.setDate(expireDate.getDate() + 30);
        //         $cookies.put('user_id', response.data.user_id, {'expires': expireDate});
        //     }
        //     $state.go('app.questionnaire');
        // } else{
        //     $scope.error_message = response.data.message;
        // }
      })
    }
  });