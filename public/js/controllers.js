angular.module('starter.controllers', [])
  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // Form data for the login modal
  })
  .controller('authCtrl', function($scope,$http,$q, $ionicModal, $timeout,$state, $location,$cookies) {
    // Form data for the login modal
    var logout = false;
    /* if (typeof $route.current.$$route.logout !== 'undefined') {
      logout = $route.current.$$route.logout;
    } */
    if (logout == true) {
      var request = {
        method: 'GET',
        url: 'http://192.155.246.146:8987/front_patient/loggedout',
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
      console.log($scope.loginData);
      postData.username = $scope.loginData.username;
      postData.password = $scope.loginData.password;
      var request = {
        method: 'POST',
        url: 'http://192.155.246.146:8987/front_patient/login',
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
  .controller('NotificationCtrl', function($scope,$http,$q,$cookies) {
    var flag = '';
    //$scope.list = function(){
      var postData = {};
      postData.patient_id = $cookies.get('user_id');
      postData.is_filled = 0;
      var request = {
        method: 'POST',
        data: 'pId=' + postData.patient_id + '&isFilled=' + postData.is_filled,
        url: 'http://192.155.246.146:8987/notification',
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
    // }
    // if (flag == "notifications") {
    //   $scope.list();
    // };
  })
  .controller('QuestionsCtrl', function($scope,$stateParams,$http,$q,$cookies) {
    var flag = '';
    var postData = {};
    var DEFAULT_PAGE_SIZE_STEP = 3;
    $scope.currentPage = 1;
    $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP; 

    $scope.loadNextPage = function(){
      $scope.currentPage++;
      $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
    }

    postData.questionnaire = $stateParams.id;
    postData.patient_id = $cookies.get('user_id');
    postData.is_filled = 0;
    var request = {
      method: 'POST',
      data: 'pId=' + postData.patient_id + '&isFilled=' + postData.is_filled + '&_id=' + postData.questionnaire,
      url: 'http://192.155.246.146:8987/questionnaire/getList',
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
  });