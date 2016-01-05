angular.module('starter.controllers', [])
  .controller('AppCtrl', function($state,$scope,$http,$q,$cookies,$rootScope) {})
  .controller('authCtrl', function($scope,$http,$ionicModal, $timeout,$state, $location,$rootScope, Flash, $ionicHistory) {
    localStorage.setItem("apiurl", "http://192.155.246.146:8987");
    $rootScope.appUrl = 'http://192.155.246.146:8987';
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
          //$cookies.remove('patient_id');
          $ionicHistory.clearHistory();
          //localStorage.removeItem("patient_id");
          localStorage.clear();
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
        if (!response.data.error) {
          //if ($scope.remember === true){
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);
            //$cookies.put('user_id', response.data.user_id, {'expires': expireDate});
            //$cookies.put('password', response.data.password, {'expires': expireDate});
            //$cookies.put('patient_id', response.data.user_id, {'expires': expireDate});
            localStorage.setItem("user_id", response.data.user_id);
            localStorage.setItem("password", response.data.password);
            localStorage.setItem("patient_id", response.data.user_id);
          //}
          $state.go('app.questionnaire');
        } else {
          $scope.error_message = response.data.message;
        }
      })
    }
  })
  .controller('PatientCtrl', function($state,$scope,$http,$q,$rootScope,Flash) {
    if(typeof $rootScope.appUrl === 'undefined'){
      $rootScope.appUrl = localStorage.getItem("apiurl");
    }
    var flag = false;
    if (typeof $state.current.flag !== 'undefined') {
      flag = $state.current.flag;
    }
    $scope.getDetails = function(){
      var patientData = {};
      var patient_id = localStorage.getItem("user_id");//$cookies.get('user_id');
      var request = {
        method: 'POST',
        data: 'pId=' + patient_id,
        url: $rootScope.appUrl+'/front_patient/getPatient',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      $http(request).then(function(response){
        if (!response.data.error) {
          $scope.patientData = response.data;
          //$scope.currentDate = new Date();
          //$scope.minDate = new Date(2105, 6, 1);
          //$scope.maxDate = new Date(2015, 6, 31);
          $scope.datePickerCallback = function (val) {
            if (!val) { 
              console.log('Date not selected');
            } else {
              console.log('Selected date is : ', val);
            }
          };
        } else{
          $scope.error_message = response.data.message;
        }
      })
    }
    $scope.getBMI = function(){
        var height = $scope.patientData.height;
        var weight = $scope.patientData.weight;
        var finalBmi = '';
        if(weight > 0 && height > 0){   
            finalBmi = (weight/(height/100*height/100)).toFixed(2);
        }
        $scope.patientData.bmi = finalBmi;
    }
    $scope.savePatient = function(){
      var post_patientData = {};
      post_patientData = JSON.stringify($scope.patientData);
      var looged_in_patient = localStorage.getItem("patient_id");//$cookies.get('patient_id');
      if(looged_in_patient == $scope.patientData._id){
        var request = {
          method: 'POST',
          url: localStorage.getItem("apiurl")+'/front_patient/update',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'post_patientData=' + post_patientData
        };
        $http(request).then(function(response){
          if (!response.data.error) {
            console.log(response.data);
            $scope.error_message = response.data.success;
            Flash.create('success', $scope.error_message, 'alert alert-success');
          } else {
            $scope.error_message = response.data.message;
          }
        })
      }
    }
    if(flag == 'profile'){
      $scope.getDetails();
    }
  })
  .controller('NotificationCtrl', function($state,$scope,$http,$q,$rootScope,$ionicPopup, $timeout,moment,$ionicModal) {
    if(typeof $rootScope.appUrl === 'undefined'){
      $rootScope.appUrl = localStorage.getItem("apiurl");
    }
    var flag = false;
    if (typeof $state.current.flag !== 'undefined') {
      flag = $state.current.flag;
    }
    
    $ionicModal.fromTemplateUrl('templates/changepassword.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    
    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };
    
    $scope.cpData = {};
    $scope.changePassword = function(){
        if(typeof $rootScope.appUrl === 'undefined'){
          $rootScope.appUrl = localStorage.getItem("apiurl");
        }
        var postData = {};
        $scope.old_pwd = '';
        postData.patient   = localStorage.getItem("user_id");//$cookies.get('user_id');
        postData.password  = localStorage.getItem("password");//$cookies.get('password');

      console.log('postData : ',postData);
        $scope.old_pwd = postData.password;
        $scope.modal.show();
    }
    
    $scope.cp_save = function(){
        if(typeof $rootScope.appUrl === 'undefined'){
          $rootScope.appUrl = localStorage.getItem("apiurl");
        }
        var postData = {};
        //postData.patient    = $cookies.get('user_id');
        postData._id        = localStorage.getItem("user_id");//$cookies.get('user_id');
        postData.password   = $scope.cpData.newpassword;

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
          if (response.data.success) {
            $scope.success_message = 'Password has been changed successfully.';
          } else{
            $scope.err_message = "Password can't be changed now.";
          }
          $timeout(function(){
                $scope.success_message = '';
                $scope.modal.remove(); //close the popup after 3 seconds for some reason
            }, 3000);
        })
    }
    
    $scope.notifications = function(){
      var postData = {};
      //postData.patient_id = $cookies.get('user_id');
      postData.patient_id = localStorage.getItem("user_id");
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
        } else{
          $scope.error_message = response.data.message;
        }
      })
    }
    
    
    if(flag == 'Notifications'){
      $scope.notifications();
    }
  })

  .controller('QuestionsCtrl', function($scope,$stateParams,$http,$state,$rootScope, Flash) {

    var flag = false;
    if (typeof $state.current.flag !== 'undefined') {
      flag = $state.current.flag;
    }
    if(typeof $rootScope.appUrl === 'undefined'){
      $rootScope.appUrl = localStorage.getItem("apiurl");
    }
    var postData = {};
    var DEFAULT_PAGE_SIZE_STEP = 10;
    $scope.currentPage = 1;
    $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP; 
    $scope.answerModel = {};
    $scope.questions = function(){
      $scope.quesData = {};
      $scope.ansData = {};
      $scope.quesType = {};
      var postData = {};
      $scope.tesd = {};

      // postData.questionnaire = $stateParams.id;
      // postData.patient_id = $cookies.get('user_id');
      // postData.is_filled = 0;

        var notification_id = $stateParams.id;
        $scope.notification_id = notification_id;
        $scope.notification = {};
    
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
            postData.questionnaire = res.data.questionnaire._id;
            $scope.notification.clinic = res.data.questionnaire.clinic;
            $scope.notification.datetime = res.data.created;
            //postData.patient_id = $cookies.get('user_id');
            postData.patient_id = localStorage.getItem("user_id");
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
              if (!response.data.error) {
                $scope.questionnaires = response.data;
                for(quest in $scope.questionnaires.question){
                  $scope.quesType[$scope.questionnaires.question[quest]._id] = $scope.questionnaires.question[quest].answer_type
                }
              } else{
                $scope.error_message = response.data.message;
              }
            })
            // $state.go('app.questionnaire');
          }else{
            $scope.error_message = 'Notification Unavailable.';
          }
        })
    }
    $scope.loadNextPage = function(){
      //console.log("load next page");
      $scope.currentPage++;
      $scope.pageSize = $scope.currentPage * DEFAULT_PAGE_SIZE_STEP;
    }
    $scope.ques_save = function(){
      if(typeof $rootScope.appUrl === 'undefined'){
        $rootScope.appUrl = localStorage.getItem("apiurl");
      }
      var admin_alerts = {};
      var admin_alerts_cb = {};
      var quesDataNew = {};
      /* To store admin alerts */
      if(typeof $scope.quesData != 'undefined') {
        for(key in $scope.quesData){
          var ansValArr = new Array();
          quesDataNew[key] = {};
          var ansVal = '';
          var ansId = '';
          if($scope.quesType[key] == 'rb' || $scope.quesType[key] == 'dd'){
            ansValArr = $scope.quesData[key].split('-');
            //console.log(ansValArr);
            ansId = ansValArr[0];
            ansVal = ansValArr[1];
            quesDataNew[key] = ansId;
            if(ansVal == 'true'){
              admin_alerts[key] = {};
              admin_alerts[key].question = key;
              admin_alerts[key].ans = ansId;
              admin_alerts[key].anstype = $scope.quesType[key];
              admin_alerts[key].patient = localStorage.getItem("user_id");//$cookies.get('user_id');
              admin_alerts[key].questionnaire = $scope.questionnaire;
              admin_alerts[key].datetime = $scope.notification.datetime;
              admin_alerts[key].clinic = $scope.notification.clinic;
            }
          }
        }
      }
      
      var anssData = {};
      if(typeof $scope.ansData != 'undefined') {
        for(quest in $scope.ansData){
          anssData[quest] = {};
          admin_alerts[quest] = {};
          var ansArr = new Array();
          var ans_cnt = 0;
          for(ansopt in $scope.ansData[quest]){
            for(ans_out in $scope.ansData[quest][ansopt]){
              if($scope.ansData[quest][ansopt][ans_out] == true){
                if(ans_out == true || ans_out == 'true'){
                  ansArr[ans_cnt] = ansopt;
                  //admin_alerts[quest].ans = ansopt;
                  ans_cnt++;
                }
                anssData[quest][ansopt] = $scope.ansData[quest][ansopt][ans_out];
              }
            }
          }
          admin_alerts[quest].question = quest;
          admin_alerts[quest].multians = ansArr;
          admin_alerts[quest].anstype = $scope.quesType[quest];
          admin_alerts[quest].patient = localStorage.getItem("user_id");//$cookies.get('user_id');
          admin_alerts[quest].questionnaire = $scope.questionnaire;
          admin_alerts[quest].datetime = $scope.notification.datetime;
          admin_alerts[quest].clinic = $scope.notification.clinic;
        }
      }

      console.log(admin_alerts);
      /* End of to store admin alerts */

      var postData = {};
      postData.patient          = localStorage.getItem("user_id");//$cookies.get('user_id');
      postData.notification_id  = $stateParams.id;
      postData.questionnaire    = $scope.questionnaire;
      //postData.quesData         = $scope.quesData;
      postData.quesData         = quesDataNew;
      //postData.ansData          = $scope.ansData;
      postData.ansData          = anssData;
      
      var postfullData = {};
      postfullData.postData = postData;
      postfullData.admin_alerts = admin_alerts;

      var request = {
        method: 'POST',
        url: $rootScope.appUrl+'/front_patient/saveans',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'postFullData=' + JSON.stringify(postfullData)
      };
      $http(request).then(function(response){
        if(response.data.success){
          $scope.error_message = 'Answers have been saved successfully.';
          Flash.create('success', $scope.error_message, 'alert alert-success');
          $state.go('app.questionnaire');
        } else {
          $scope.error_message = response.data.message;
        }
      });
    }
    alert(flag);
    if(flag=='questions'){
      $scope.questions();
    }
  });
