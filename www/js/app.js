// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordovaBeacon', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.attendance', {
    url: '/attendance',
    views: {
      'menuContent': {
        templateUrl: 'templates/attendance.html',
        controller: 'TeacherCtrl'
      }
    }
  })
  .state('app.classCode', {
    url: '/classCode',
    views: {
      'menuContent': {
        templateUrl: 'templates/classCode.html',
        controller: 'ClassCodeCtrl'
      }
    }
  })
    .state('app.studentList', {
    url: '/studentList',
    views: {
      'menuContent': {
        templateUrl: 'templates/studentList.html',
        controller: 'StudentListCtrl'
      }
    }
  })
  .state('app.beacons', {
    url: '/beacons',
    views: {
      'menuContent': {
        templateUrl: 'templates/beacons.html',
        controller: 'BeaconCtrl'
      }
    }
  })
  .state('app.roomMap', {
    url: '/roomMap',
    views: {
      'menuContent': {
        templateUrl: 'templates/roomMap.html',
        controller: 'roomMapCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/attendance');
});