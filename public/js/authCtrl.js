//angular.module('starter.controllers', [])
starter
  .controller('authCtrl', function($scope,$http,$q, $ionicModal, $timeout,$state, $location) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
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
            if ($scope.remember === true){
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);
                $cookies.put('user_id', response.data.user_id, {'expires': expireDate});
            }
            $state.go('app.questionnaire');
        } else{
            $scope.error_message = response.data.message;
        }
      })
    }
  })