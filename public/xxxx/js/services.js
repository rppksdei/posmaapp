var deals = angular.module('deals.services', ['ngResource']);
    
    /*
    deals.config(['$httpProvider', function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
        $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.useXDomain = true;
    }]);
    */

    deals.factory('DealService', function($resource, $q, $http) {
        var rating = '5';
        // We use promises to make this api asynchronous. This is clearly not necessary when using in-memory data
        // but it makes this service more flexible and plug-and-play. For example, you can now easily replace this
        // service with a JSON service that gets its data from a remote server without having to changes anything
        // in the modules invoking the data service since the api is already async.

        return {
            
            findAllDeals: function() {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(DEALS_LISTING));
                return deferred.promise;

            },
            findLatestDeals: function() {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(LATEST_DEALS));
                return deferred.promise;

            },
            findPopularDeals: function() {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(POPULAR_DEALS));
                return deferred.promise;

            },
            findFavoriteDeals: function() {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(FAVORITE_DEALS));
                return deferred.promise;

            },
            findLowToHighPriceDeals: function(sort_type) {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(PRICE_LOW_HIGH_DEALS+'/'+sort_type));
                return deferred.promise;

            },
            findHighToLowPriceDeals: function(sort_type) {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(PRICE_HIGH_LOW_DEALS+'/'+sort_type));
                return deferred.promise;

            },
            findLocalDeals: function(lat, lng) {

                var promise = $http({
                    url: LOCAL_DEALS,
                    method: 'POST',
                    data:   'lat='  +lat+
                            '&lng=' +lng,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise;            

            },
            findCatDeals: function(cat_id) {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(CAT_DEALS+'/'+cat_id));
                return deferred.promise;

            },
            findMyDeals: function(session_id) {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(MY_DEALS+'/'+session_id));
                return deferred.promise;

            },
            findAllDealCategories: function() {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(DEAL_CATEGORIES));
                return deferred.promise;

            },
            findAllBusinessAddr: function(session_id) {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(BUSINESS_ADDRESS+'/'+session_id));
                return deferred.promise;

            },
            findAllBusinessAddrLatLong: function() {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(GET_LAT_LONG));
                return deferred.promise;

            },
            findDealById: function(dealId) {
                
                var deferred = $q.defer();                
                deferred.resolve($http.get(SINGLE_DEAL+'/'+dealId));
                return deferred.promise;
            },

            findByName: function(searchKey) {
                var deferred = $q.defer();
                var results = employees.filter(function(element) {
                    var fullName = element.firstName + " " + element.lastName;
                    return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
                });
                deferred.resolve(results);
                return deferred.promise;
            },

            findByManager: function (managerId) {
                var deferred = $q.defer(),
                    results = employees.filter(function (element) {
                        return parseInt(managerId) === element.managerId;
                    });
                deferred.resolve(results);
                return deferred.promise;
            },

            getDealRating: function (dealId) {
                var deferred = $q.defer();                
                deferred.resolve($http.get(GET_RATING+'/'+dealId));
                return deferred.promise;
            },

            getDealReviews: function (dealId) {
                var deferred = $q.defer();                
                deferred.resolve($http.get(GET_REVIEWS+'/'+dealId));
                return deferred.promise;
            },

            getDynamicRating: function () {
                var deferred = $q.defer(); 
                deferred.resolve(rating);
                return deferred.promise;
            },

            setDynamicRating: function (ratingValue) {
                var deferred = $q.defer();
                rating = ratingValue;     
                deferred.resolve(rating);
                return deferred.promise; 
            },

            createDeal: function (deal) {
                var promise = $http({
                    url: CREATE_DEAL,
                    method: 'POST',
                    data:   'biz_address_id='        +deal.bizAddrId+
                            '&deal_category='        +deal.dealCat+
                            '&deal_link='            +deal.deal_link+
                            '&deal_name='            +deal.deal_name+
                            '&deal_description='     +deal.deal_description+
                            '&deal_from='            +deal.from+
                            '&deal_price='           +deal.deal_price+
                            '&deal_short_desc='      +deal.deal_short_desc+
                            '&dealImage='            +encodeURIComponent(deal.dealImageData)+
                            '&dealIcon='             +encodeURIComponent(deal.dealIconData)+
                            '&deal_keyword='         +deal.deal_keyword+
                            '&deal_to='              +deal.to+
                            '&deal_video='           +deal.deal_video+
                            '&deal_zipcode='         +deal.deal_zipcode+
                            '&deal_favourite='       +deal.favourite+
                            '&deal_owner='           +deal.dealOwner,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            },

            postReviewsOnDeal: function (reviews) {
                var promise = $http({
                    url: POST_REVIEWS,
                    method: 'POST',
                    data:   'deal_id='     +reviews.deal_id+
                            '&review='     +reviews.review+
                            '&reviewby='   +reviews.reviewby+
                            '&deal_owner=' +reviews.deal_owner,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            },

            postRatingOnDeal: function (rating) {
                var promise = $http({
                    url: POST_RATING,
                    method: 'POST',
                    data:   'deal_id='      +rating.deal_id+
                            '&rating='      +rating.rating+
                            '&ratedby='     +rating.ratedby+
                            '&deal_owner='  +rating.deal_owner,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            },

            publishUnpublishDeal: function (deal_publish, deal_id, deal_owner) {
                var promise = $http({
                    url: UNPUBLISH_DEAL,
                    method: 'POST',
                    data:   'deal_publish=' +deal_publish+
                            '&id='          +deal_id+
                            '&deal_owner='  +deal_owner,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            },

            flagDeal: function (deal_id, deal_owner, flagby) {
                var promise = $http({
                    url: FLAG_DEAL,
                    method: 'POST',
                    data:   'deal_id='      +deal_id+
                            '&deal_owner='  +deal_owner+
                            '&flagby='      +flagby,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            }

        }
    }).factory('LoginService',   function($q, $http, $window) {
        return {
            loginUser: function(user) {
                                
                var promise = $http({
                    url: USER_LOGIN,
                    method: 'POST',
                    data:   'username='         +user.email+
                            '&password='        +user.password+
                            '&device_id='       +user.deviceId+
                            '&latitude='        +user.latitude+
                            '&longitude='       +user.longitude+
                            '&user_location='   +user.user_location,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        "Accept": "application/json",
                        // "Access-Control-Allow-Credentials":true,
                        // 'authorization':'Basic dGF4aTphcHBsaWNhdGlvbg=='
                    }
                }).success(function(data, status, headers, config) {
                    window.localStorage['userData'] = JSON.stringify(data);
                    return data;                    
                });    

                return promise;
                // 'username=manojks@smartdatainc.net&password=manojks'            
            },
            getLocationByLatLong: function(latitude,longitude) {

                var deferred = $q.defer();                
                deferred.resolve($http.get(GET_ADDR + latitude + ',' + longitude +'&key='+GEOCODER_API_KEY));
                return deferred.promise;

            }
        }
    }).factory('RegisterService',function($q, $http) {
        return {
            registerUser: function(user) {

                var promise = $http({
                    url: USER_REGISTER,
                    method: 'POST',
                    data:   'first_name='   +user.firstname+
                            '&last_name='   +user.lastname+
                            '&phone='       +user.phone+
                            '&email='       +user.email+
                            '&password='    +user.password+
                            '&gender='      +user.gender+
                            '&zipcode='     +user.zip+
                            '&dob='         +user.dob+
                            '&profilePic='  +encodeURIComponent(user.profilePic)+
                            '&agree='       +user.agree+
                            '&role='        +user.role+
                            '&latitude='    +user.latitude+
                            '&longitude='   +user.longitude,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 

                // 'username=manojks@smartdatainc.net&password=manojks'

            }
        }
    }).factory('ContactService', function($q, $http) {
        return {
            contactAdmin: function(user) {

                var promise = $http({
                    url: ADMIN_CONTACT,
                    method: 'POST',
                    data:   'first_name='   +user.firstname+
                            '&last_name='   +user.lastname+
                            '&phone='       +user.phone+
                            '&email='       +user.email+
                            '&message='     +user.message+                            
                            '&role='        +user.role,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 

                // 'username=manojks@smartdatainc.net&password=manojks'

            }
        }
    }).factory('ForgotService',  function($q, $http) {
        return {
            forgotUser: function(email) {

                // console.log(user);

                var promise = $http({
                    url: USER_FORGOT,
                    method: 'POST',
                    data:   'email='   +email,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 

                // 'username=manojks@smartdatainc.net&password=manojks'

            }
        }
    }).factory('Locations',      function($q, $http) {
        return {
            getLocations: function() {


                var latLongData = [
                    {
                      
                      "latitude" : 30.6799468,
                      "longitude" : 76.7221082
                    },
                    {
                      
                      "latitude" : 30.7500,
                      "longitude" : 76.7800
                    },
                    {
                      
                      "latitude" : 28.5700,
                      "longitude" : 77.3200
                    }
                    ,{
                      
                      "latitude" : 28.9800,
                      "longitude" : 77.0200
                    },
                    {
                      
                      "latitude" : 28.4700,
                      "longitude" : 77.0300
                    }

                ];
 
                // console.log(user);

                var promise = $http.get(DEALS_LISTING).success(function(data, status, headers, config) {
               
                    return data;
                    // return latLongData;
                });
                return promise;

            }
        }
    }).factory('AddressService', function($q, $http) {
        return {
            addAddress: function (address) {
                var promise = $http({
                    url: ADD_BIZ_ADDRESS,
                    method: 'POST',
                    data:   'biz_address='  +address.biz_address+
                            '&biz_zipcode=' +address.biz_zipcode+
                            '&biz_lat='     +address.biz_lat+
                            '&biz_long='    +address.biz_long+
                            '&biz_owner='   +address.biz_owner,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            },
            deleteAddress: function (address) {
                var promise = $http({
                    url: DELETE_BIZ_ADDRESS,
                    method: 'POST',
                    data:   'id='           +address.biz_id+
                            '&biz_status='  +address.biz_status,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            },
            getLatLongByLocation: function(address) {

                var deferred = $q.defer();                
                deferred.resolve($http.get(GET_LAT_LONG + address +'&key='+GEOCODER_API_KEY));
                return deferred.promise;
                
            }
        }
    }).factory('CreditsService', function($q, $http) {
        return {
            getCredits: function (user_id) {
               var deferred = $q.defer();                
                deferred.resolve($http.get(CHECK_CREDITS+'/'+user_id));
                return deferred.promise;
            },
            getPackages: function () {
               var deferred = $q.defer();                
                deferred.resolve($http.get(GET_PACKAGES));
                return deferred.promise;
            }
        }
    }).factory('ReviewsService', function($q, $http) {
        return {
            findMyReveiws: function (user_id) {
               var deferred = $q.defer();                
                deferred.resolve($http.get(MY_REVIEWS+'/'+user_id));
                return deferred.promise;
            },
            updateMyReview: function (status, review_id) {
               var promise = $http({
                    url: UPDATE_REVIEW_STATUS,
                    method: 'POST',
                    data:   'id='  +review_id+
                            '&status='    +status,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            }
        }
    }).factory('SharingService', function($q, $http) {
        return {
            getShares: function (id) {
               var deferred = $q.defer();                
                deferred.resolve($http.get(GET_SHARES+'/'+id));
                return deferred.promise;
            },
            addShare: function (deal_id, shareby, deal_owner, type) {
               var promise = $http({
                    url: POST_SHARE,
                    method: 'POST',
                    data:   'deal_id='      +deal_id+
                            '&shareby='     +shareby+
                            '&deal_owner='  +deal_owner+
                            '&type='        +type,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 
            }
        }
    }).factory('ProfileService', function($q, $http) {
        return {
            editProfile: function(userProfileData) {

                var promise = $http({
                    url: USER_PROFILE_EDIT,
                    method: 'POST',
                    data:   'first_name='   +userProfileData.first_name+
                            '&last_name='   +userProfileData.last_name+
                            '&phone='       +userProfileData.phone+
                            '&zipcode='     +userProfileData.zipcode+
                            '&dob='         +userProfileData.dob+
                            '&_id='         +userProfileData._id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise; 

                // 'username=manojks@smartdatainc.net&password=manojks'

            },
            findProfileDetailsById: function(user_id) {

                var deferred = $q.defer(); 
                deferred.resolve($http.get(USER_PROFILE_DETAIL+'/'+user_id));
                return deferred.promise;

            }
        }
    }).factory('AppInit', function ($q, $cordovaSplashscreen, $ionicPlatform, $timeout) {
        return {
            splash: function() {

                var deferred = $q.defer();

                $ionicPlatform.ready(function(){
                    $timeout(function(){
                        $cordovaSplashscreen.hide();
                        deferred.resolve();
                    }, 1500);
                });

                return deferred.promise;
                
            }
        };
    });






    deals.directive('map',['$http', 'Locations', 'DealService', '$cordovaGeolocation',function($http, Locations, DealService, $cordovaGeolocation){
     return{
        
        restrict : 'A',

        link : function(scope,elements,attr){

            var posOptions = {timeout: 10000, enableHighAccuracy: false};
  
            $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(function (position) {      
                
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;

                console.log(latitude + ' : ' + longitude);

                putMarkerLastStep(latitude, longitude);                
                
            }, function(err) {        
                console.log(err);
                var latitude  = 0;
                var longitude = 0;
                putMarkerLastStep(latitude, longitude);  
            });


            /**** this rendering of markers via ng resource using service Locations ****/

            var putMarkerLastStep = function (latitude, longitude) {
      
                var myOptions = {
                      center: new google.maps.LatLng(28.6100, 77.2300),
                      zoom: 7,
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
              
                var map = new google.maps.Map(document.getElementById("map"),myOptions);

                var response = [
                                    {
                                      
                                      "latitude" : 30.6799468,
                                      "longitude" : 76.7221082
                                    },
                                    {
                                      
                                      "latitude" : 30.7500,
                                      "longitude" : 76.7800
                                    },
                                    {
                                      
                                      "latitude" : 28.5700,
                                      "longitude" : 77.3200
                                    }
                                    ,{
                                      
                                      "latitude" : 28.9800,
                                      "longitude" : 77.0200
                                    },
                                    {
                                      
                                      "latitude" : 28.4700,
                                      "longitude" : 77.0300
                                    }

                                ];

                DealService.findLocalDeals(latitude, longitude).then(function (deals) {
                    
                    console.log(deals.data);
                    var business_coordinates = deals.data;
                    


                    for(var i=0;i<response.length;i++)
                    {
                        var latdata = response[i].latitude;
                        var longdata = response[i].longitude;
                        latlongDataset = new google.maps.LatLng(latdata, longdata);
                        var marker = new google.maps.Marker({
                            position : latlongDataset
                        });

                        marker.setMap(map);
                    }

                });
            };
        }
      }

    }]);