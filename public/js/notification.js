angular.module('starter.controllers', [])
.controller('NotificationCtrl', function($scope,$http,$q) {
	var flag = '';
	console.log('gfjkdfj');
 	//$scope.list = function(){
		console.log('list');
		var postData = {};
		postData.patient_id = $scope.pid;
		postData.is_filled = 0;
		console.log('HERE');
		var request = {
			method: 'GET',
			url: 'http://192.155.246.146:8987/notification',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'pId=' + postData.patient_id + '&isFilled=' + postData.is_filled
	  	};
		$http(request).then(function(response){
			console.log(response.data);
			if (!response.data.error) {
			    $scope.questionnaires = response.data;
			} else{
			    $scope.error_message = response.data.message;
			}
		})
	//}
	//if (flag == "notifications") {
        //$scope.list();
    //};
});