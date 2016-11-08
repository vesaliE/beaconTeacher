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
   
   $scope.uniqueKeyNum = function(token, beacon){
     var uniqueKey = fbServer.child(token).child(beacon); 
     //.child("b9407f30-f5f8-466e-aff9-25556b57fe6d:15956:22958");
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
    var studentFBref = new Firebase("https://beaconfunction.firebaseio.com/");
    $scope.displayList = function(){
      var studentList = $firebaseObject(studentFBref)
        studentList.$bindTo($scope, "data");
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

})

.controller('roomMapCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaBeacon, $firebase) {

  $scope.beacons = {};

  $ionicPlatform.ready(function() {

        $cordovaBeacon.requestWhenInUseAuthorization();

        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            var uniqueBeaconKey;
            for(var i = 0; i < pluginResult.beacons.length; i++) {
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
                
            }
            $scope.$apply();
            
        });

        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));

    });
  
  $scope.iceDistance = -9999;
  $scope.blueberryDistance = -9999;
  $scope.mintDistance = -9999;
  
  $scope.lockIce = function() {
      angular.forEach($scope.beacons, function(value, index) {

        if (value.major == 15956 && value.minor == 22958) {
          console.log(value.major + " " + value.minor);
          $scope.iceDistance = value.accuracy;
        }
      })
  }

  $scope.lockBlueberry = function() {
    angular.forEach($scope.beacons, function(value, index) {

      if (value.major == 54228 && value.minor == 17064) {
          console.log(value.major + " " + value.minor);
          $scope.blueberryDistance = value.accuracy;
        
      }
    })
  }

  $scope.lockMint = function() {
    angular.forEach($scope.beacons, function(value, index) {

      if (value.major == 61897 && value.minor == 45819) {
          console.log(value.major + " " + value.minor) 
          $scope.mintDistance = value.accuracy;
        
      }
    })
  }

  $scope.IceBlueberry = -9999;
  $scope.IceMint = -9999;
  $scope.BlueberryMint = -9999;
  
  $scope.getIB = function(classCode) {
    $scope.IceBlueberry = $scope.iceDistance;
    var beacon = new Firebase("https://beaconfunction.firebaseio.com/BeaconDistance");
    beacon.child(classCode).child("IceBlueberry").set({
      distance: $scope.iceDistance
    })

  }

  $scope.getIM = function(classCode) {
    $scope.IceMint = $scope.iceDistance;
    var beacon = new Firebase("https://beaconfunction.firebaseio.com/BeaconDistance");
    beacon.child(classCode).child("IceMint").set({
      distance: $scope.iceDistance
    })
  }

  $scope.getBM = function(classCode) {
    $scope.BlueberryMint = $scope.mintDistance;
    var beacon = new Firebase("https://beaconfunction.firebaseio.com/BeaconDistance");
    beacon.child(classCode).child("BlueberryMint").set({
      distance: $scope.iceDistance
    })
  }
    

}); 