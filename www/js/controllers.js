angular.module('starter.controllers', ['firebase'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
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

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('TeacherCtrl', function($scope, $firebase, $firebaseObject){
     var fbServer = new Firebase("https://beaconfunction.firebaseio.com")
    $scope.list = function() {
        var beaconList = $firebaseObject(fbServer)
        beaconList.$bindTo($scope, "data");
    }

    $scope.getTimeStudent = function(number) {
        var date = new Date(number);
        var number = date.getHours();
        var hour = date.getHours().toString();
        var min = date.getMinutes().toString();
        return date.toLocaleString();
    }


})
.controller('BeaconCtrl', function($scope, $firebase, $firebaseObject){
  var fbServer = new Firebase("https://beaconfunction.firebaseio.com/Beacons")
  $scope.list = function() {
  var beaconList = $firebaseObject(fbServer)
        beaconList.$bindTo($scope, "data");
    }

});