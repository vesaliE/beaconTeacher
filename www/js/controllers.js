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
 var fbServer = new Firebase("https://beaconfunction.firebaseio.com/Classes");
 /*$scope.list = function() {
  var codeList = $firebaseObject(fbServer)
  codeList.$bindTo($scope, "data");
}*/
//calculate coor for each stu 
//add into student list as an object 
// ng-repeat it 
//display stu in room 
 //$scope.studentList = [];
$scope.uniqueKeyNum = function(classNum){
 var uniqueKey = fbServer.child(classNum);
 //$scope.id = '10992976-c02e-4847-9883-6a7d375f17ff'; 
     //uniqueKey.$bindTo($scope, "info");
     uniqueKey.on("value", function(snapshot) {
      $scope.studentList = [];
      snapshot.forEach(function(childSnapshot){
        $scope.id = childSnapshot.child("b9407f30-f5f8-466e-aff9-25556b57fe6d:15956:22958").child("name").val()
        //console.log($scope.id);
        var iceDist = childSnapshot.child("b9407f30-f5f8-466e-aff9-25556b57fe6d:15956:22958").child("distance").val();
        //console.log("iceDist: " + iceDist);
        var blueberryDist = childSnapshot.child("b9407f30-f5f8-466e-aff9-25556b57fe6d:54228:17064").child("distance").val();
        var mintDist = childSnapshot.child("b9407f30-f5f8-466e-aff9-25556b57fe6d:61897:45819").child("distance").val();
        $scope.date = childSnapshot.child("b9407f30-f5f8-466e-aff9-25556b57fe6d:15956:22958").child("date").val();
        var xCoor = getCoordinatesX(mintDist, iceDist, blueberryDist, classNum);
        var yCoor = getCoordinatesY(mintDist, iceDist, blueberryDist, classNum);
        //if(((xCoor<= $scope.Height || xCoor <= $scope.Width)&& xCoor>=0) && ((yCoor<= $scope.Height || yCoor <= $scope.Width)&& yCoor >=0))
        var student = {id: $scope.id, xCoordinate: xCoor, yCoordinate: yCoor}
        //var student = [$scope.id, xCoor, yCoor];
        console.log(student.id)
        $scope.studentList.push(student);
        console.log($scope.studentList);
        })
      })
   }
  
  getCoordinatesX = function(mintDistance, iceDistance, blueberryDistance, classNum) {
    var roomNum = new Firebase("http://beaconfunction.firebaseio.com/BeaconDistance");
    var room = roomNum.child(classNum);
    room.on("value", function(snapshot) {
      $scope.Height = snapshot.child("Height").val(); 
      $scope.Width = snapshot.child("BlueberryMint").val();
       console.log($scope.Height);
      var MintX = 0; //xa
      var MintY = 0; //ya
      var BlueberryX = $scope.Width; //xb
      var BlueberryY = 0; //yb
      var IceX = $scope.Width / 2; //xc
      var IceY = $scope.Height; //yc

      var S = (Math.pow(IceX, 2.) - Math.pow(BlueberryX, 2.) + Math.pow(IceY, 2.) - Math.pow(BlueberryY, 2.) + Math.pow(blueberryDistance, 2.) - Math.pow(iceDistance, 2.)) / 2.0;
      var T = (Math.pow(MintX, 2.) - Math.pow(BlueberryX, 2.) + Math.pow(MintY, 2.) - Math.pow(BlueberryY, 2.) + Math.pow(iceDistance, 2.) - Math.pow(mintDistance, 2.)) / 2.0;
      var y = ((T * (BlueberryX - IceX)) - (S * (BlueberryX - MintX))) / (((MintY - BlueberryY) * (BlueberryX - IceX)) - ((IceY - BlueberryY) * (BlueberryX - MintX)));
      var x = ((y * (MintY - BlueberryY)) - T) / (BlueberryX - MintX);
      $scope.x_coor = x; //x-coordinate 
      $scope.y_coor = y; //y-coordinate 
      return $scope.x_coor;
    })
  
  }
  getCoordinatesY = function(mintDistance, iceDistance, blueberryDistance, classNum) {
    var roomNum = new Firebase("http://beaconfunction.firebaseio.com/BeaconDistance");
    var room = roomNum.child(classNum);
    room.on("value", function(snapshot) {
      $scope.Height = snapshot.child("Height").val(); 
      $scope.Width = snapshot.child("BlueberryMint").val();
      var MintX = 0; //xa
      var MintY = 0; //ya
      var BlueberryX = $scope.Width; //xb
      var BlueberryY = 0; //yb
      var IceX = $scope.Width / 2; //xc
      var IceY = $scope.Height; //yc

      var S = (Math.pow(IceX, 2.) - Math.pow(BlueberryX, 2.) + Math.pow(IceY, 2.) - Math.pow(BlueberryY, 2.) + Math.pow(blueberryDistance, 2.) - Math.pow(iceDistance, 2.)) / 2.0;
      var T = (Math.pow(MintX, 2.) - Math.pow(BlueberryX, 2.) + Math.pow(MintY, 2.) - Math.pow(BlueberryY, 2.) + Math.pow(iceDistance, 2.) - Math.pow(mintDistance, 2.)) / 2.0;
      var y = ((T * (BlueberryX - IceX)) - (S * (BlueberryX - MintX))) / (((MintY - BlueberryY) * (BlueberryX - IceX)) - ((IceY - BlueberryY) * (BlueberryX - MintX)));
      var x = ((y * (MintY - BlueberryY)) - T) / (BlueberryX - MintX);
      $scope.x_coor = x; //x-coordinate 
      $scope.y_coor = y; //y-coordinate 
       return $scope.y_coor;
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
  var fbRef = new Firebase("https://beaconfunction.firebaseio.com/StudentList");
  $scope.displayList = function(){
    //var studentNameList = $firebaseObject(fbRef);
    //studentNameList.$bindTo($scope, "data");
    
    fbRef.on("value", function(snapshot) {
       $scope.studentNameList = [];
      snapshot.forEach(function(childSnapshot){
        var stuname = childSnapshot.child("fullName").val();
        console.log(stuname);
        var uName = childSnapshot.child("displayedName").val();
        var mNumber = childSnapshot.child("matricNumber").val();
        var student = {name: stuname, userName:uName, matricNumber: mNumber};
        console.log($scope.studentNameList);
        $scope.studentNameList.push(student);
      })
    })
  }

})
.controller('BeaconCtrl', function($scope, $firebase, $firebaseObject){
  var classesFB = new Firebase("http://beaconfunction.firebaseio.com/Classes/1996");

  $scope.getCoordinates = function(mintDistance, iceDistance, blueberryDistance) {
    var room = new Firebase("http://beaconfunction.firebaseio.com/BeaconDistance/3245");
    room.on("value", function(snapshot) {
      $scope.Height = snapshot.child("Height").val(); 
      $scope.Width = snapshot.child("BlueberryMint").val();

      var MintX = 0; //xa
      var MintY = 0; //ya
      var BlueberryX = $scope.Width; //xb
      var BlueberryY = 0; //yb
      var IceX = $scope.Width / 2; //xc
      var IceY = $scope.Height; //yc

      var S = (Math.pow(IceX, 2.) - Math.pow(BlueberryX, 2.) + Math.pow(IceY, 2.) - Math.pow(BlueberryY, 2.) + Math.pow(blueberryDistance, 2.) - Math.pow(iceDistance, 2.)) / 2.0;
      var T = (Math.pow(MintX, 2.) - Math.pow(BlueberryX, 2.) + Math.pow(MintY, 2.) - Math.pow(BlueberryY, 2.) + Math.pow(iceDistance, 2.) - Math.pow(mintDistance, 2.)) / 2.0;
      var y = ((T * (BlueberryX - IceX)) - (S * (BlueberryX - MintX))) / (((MintY - BlueberryY) * (BlueberryX - IceX)) - ((IceY - BlueberryY) * (BlueberryX - MintX)));
      var x = ((y * (MintY - BlueberryY)) - T) / (BlueberryX - MintX);
      $scope.x_coor = x; //x-coordinate 
      $scope.y_coor = y; //y-coordinate 


    })
    


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
  $scope.BlueberryMint = -9999; //Width
  $scope.Height = 0; //Height
  
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

  $scope.getRoom = function(classCode) {
    var middle = $scope.BlueberryMint / 2;
    $scope.Height = Math.sqrt((middle * middle) + ($scope.BlueberryMint * $scope.BlueberryMint));
    var beacon = new Firebase("https://beaconfunction.firebaseio.com/BeaconDistance");
    beacon.child(classCode).child("Height").set({
      height: $scope.Height
    })
  }


}); 