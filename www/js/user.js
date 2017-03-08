angular.module('myappts.user', [])
  .factory('User', function ($http) {

    var apiUrl = 'http://192.168.3.87:3000';
    var token = localStorage['secure-token'] || '';

    if (isNotEmpty(token)) {
      setHeader(token);
    }

    function isNotEmpty(token) {
      return token !== '';
    }

    function setHeader(token) {
      $http.defaults.headers.common['secure-token'] = token;
    }

    return {

      login: function (credentials) {
        return $http.post(apiUrl + '/auth', credentials)
          .then(function (response) {
            token = localStorage['secure-token'] = response.data.token;
            setHeader(token);
          });
      },

      isLoggedIn: function () {
        return isNotEmpty(token);
      }

    };
  });
