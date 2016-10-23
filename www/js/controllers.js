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
.controller('ClassCodeCtrl', function($scope, $firebase, $firebaseObject){
     var fbServer = new Firebase("https://beaconfunction.firebaseio.com/Classes")
    $scope.list = function() {
        var codeList = $firebaseObject(fbServer)
        codeList.$bindTo($scope, "data");
    }
   
   $scope.uniqueKeyNum = function(){
     var uniqueKey = fbServer.child("3452").child("b9407f30-f5f8-466e-aff9-25556b57fe6d:15956:22958");
     //uniqueKey.$bindTo($scope, "info");
      uniqueKey.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot){
        $scope.name = childSnapshot.child("name").val();
        $scope.beacon = childSnapshot.child("beacon").val();
        $scope.date = childSnapshot.child("date").val();
        $scope.distance = childSnapshot.child("distance").val();
      })
    })
    }
    $scope.getTimeStudent = function(number) {
        var date = new Date(number);
        var number = date.getHours();
        var hour = date.getHours().toString();
        var min = date.getMinutes().toString();
        return date.toLocaleString();
    }
    $scope.getStudentName = function(name){
        var fb = new Firebase("https://beaconfunction.firebaseio.com/StudentList")
        fb.on("value", function(snapshot) {
        $scope.fullname = snapshot.child(name).child("fullName").val();
    })
        return $scope.fullname;
  }
    $scope.getStudentMatric = function(name){
        var fb = new Firebase("https://beaconfunction.firebaseio.com/StudentList")
        fb.on("value", function(snapshot) {
        $scope.matricNum =  snapshot.child(name).child("matricNumber").val();
    })
      return $scope.matricNum;
    }

  

})
.controller('StudentListCtrl', function($scope, $firebase, $firebaseObject){
    var studentFBref = new Firebase("https://beaconfunction.firebaseio.com/StudentList");
    $scope.displayList = function(){
      var studentList = $firebaseObject(studentFBref)
        studentList.$bindTo($scope, "info");
      /*fb.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot){
        $scope.name = childSnapshot.child("fullName").val();
        $scope.userName = childSnapshot.child("displayedName").val();
        $scope.matricNumber = childSnapshot.child("matricNumber").val();
      })
    })*/
    }

})
.controller('BeaconCtrl', function($scope, $firebase, $firebaseObject){
  var fbServer = new Firebase("https://beaconfunction.firebaseio.com/Beacons")
  $scope.list = function() {
  var beaconList = $firebaseObject(fbServer)
        beaconList.$bindTo($scope, "data");
    }

});