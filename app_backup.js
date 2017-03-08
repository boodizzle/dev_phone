(function () {

  var app = angular.module('myappts', ['ionic', 'myappts.user', 'myappts.apptstore']);

  app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      cache: false

    });

    $stateProvider.state('list', {
      url: '/',
      templateUrl: 'templates/list.html',
      controller: 'ListCtrl',
      cache: false
    });

    $stateProvider.state('appt', {
      url: '/appt/:apptid',
      templateUrl: 'templates/appt.html',
      controller: 'ApptCtrl'
    });

    $stateProvider.state('options', {
      url: '/options',
      templateUrl: 'templates/options.html',
      controller: 'ListCtrl',
      cache: false
    });

    $urlRouterProvider.otherwise('/');
  });

  // LoginCtrl
  app.controller('LoginCtrl', function ($scope, $state, $ionicHistory, User) {

    $scope.credentials = {
      user: '',
      password: ''
    };
    $scope.loginFailed = false;

    $scope.login = function () {
      User.login($scope.credentials)
        .then(function () {
          $ionicHistory.nextViewOptions({ historyRoot: true });
          $state.go('list');
        })
        .catch(function () {
          $scope.loginFailed = true;
        });
    };
  });
  // ListCtrl
  app.controller('ListCtrl', function ($scope, ApptStore) {

    // list appointments
    function refreshAppts(res, date) {
      console.log('resource id: ' + res);
      console.log('date: ' + date);
      ApptStore.list(res, date).then(function (response) {
        console.log(response);
        $scope.appointments = response;
      });
    }
    // refreshAppts();

    // $scope.doRefresh = function () {
    //   ApptStore.list().then(function (response) {
    //     $scope.appointments = response;
    //   })
    //     .finally(function () {
    //       // Stop the ion-refresher from spinning
    //       $scope.$broadcast('scroll.refreshComplete');
    //     });
    // };

    // Resources
    function refreshResources() {
      ApptStore.resources().then(function (response) {
        $scope.resources = response;
        $scope.options = {};
      });
    };
    refreshResources();

    // Todays date
    function todaysDate() {
      var date = new Date();
      $scope.dates = {};
      $scope.defaultToday = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    };
    todaysDate();


    // Options Updates
    $scope.optionsUpdate = function (res, defaultDate, choiceDate) {
      if (typeof (res) === 'undefined') {
        return console.log('stopping, no res defined')
      } else {
        if (typeof (choiceDate) === 'undefined') {
          ApptStore.test(res, defaultDate).then(function (response) {
            console.log(response);
          });
        } else {
          var formatDate = choiceDate.getFullYear() + ('0' + (choiceDate.getMonth() + 1)).slice(-2) + ('0' + choiceDate.getDate()).slice(-2);
          // ApptStore.test(res, formatDate).then(function (response) {
          //   $scope.appointments = response;
          //   console.log('scope: ')
          //   console.log($scope.appointments);
          // });
          console.log(res);
          console.log(formatDate)
              refreshAppts(res, formatDate);
        };
      };
    };


  });

  // ApptCtrl
  app.controller('ApptCtrl', function ($scope, $state, ApptStore) {
    ApptStore.getappt($state.params.apptid).then(function (response) {
      $scope.single = response[0];
      $scope.single.extID = $state.params.apptid;
    });
  });

  // OptsCtrl
  app.controller('OptsCtrl', function ($scope, ApptStore) {
    // // Resources
    // function refreshResources() {
    //   ApptStore.resources().then(function (response) {
    //     $scope.resources = response;
    //     $scope.options = {};
    //   });
    // };
    // refreshResources();

    // // Todays date
    // function todaysDate() {
    //   var date = new Date();
    //   $scope.dates = {};
    //   $scope.defaultToday = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    // };
    // todaysDate();

    // function refreshAppts(opts) {
    //   ApptStore.list(opts).then(function (response) {
    //     $scope.appointments = response;
    //   });
    // }

    // // Options Updates
    // $scope.optionsUpdate = function (res, defaultDate, choiceDate) {
    //   if (typeof (res) === 'undefined') {
    //     return console.log('stopping, no res defined')
    //   } else {
    //     if (typeof (choiceDate) === 'undefined') {
    //       ApptStore.test(res, defaultDate).then(function (response) {
    //         console.log(response);
    //       });
    //     } else {
    //       var formatDate = choiceDate.getFullYear() + ('0' + (choiceDate.getMonth() + 1)).slice(-2) + ('0' + choiceDate.getDate()).slice(-2);
    //       ApptStore.test(res, formatDate).then(function (response) {
    //         $scope.appointments = response;
    //         console.log('scope: ')
    //         console.log($scope.appointments);
    //       });
    //     };
    //   };
    // };

  });


  // RUN
  app.run(function ($rootScope, $state, $ionicPlatform, User) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {

      if (!User.isLoggedIn() && toState.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }

    });

    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

}());
