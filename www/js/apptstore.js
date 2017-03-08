angular.module('myappts.apptstore', [])
	.factory('ApptStore', function ($http) {

		var apiUrl = 'http://192.168.3.87:3000';
		var res = {};
		var date = {};


		return {

			list: function () {
				return $http.get(apiUrl + '/auth/resource/appts?res_id=' + res + '&appt_date=' + date)
					.then(function (response) {
						if (response.data.command === 1984) {
							localStorage['secure-token'] = ''
						} else {
							return response.data;
						}
					});
			},

			getappt: function (apptid) {
				return $http.get(apiUrl + '/auth/resource/appts/appt?appt_id=' + apptid)
					.then(function (response) {
						if (response.data.command === 1984) {
							localStorage['secure-token'] = ''
						} else {
							return response.data;
						}
					});
			},
			resources: function () {
				return $http.get(apiUrl + '/auth/resource')
					.then(function (response) {
						if (response.data.command === 1984) {
							localStorage['secure-token'] = ''
						} else {
							return response.data;
						}
					});
			},
			setUserParams: function (resid, dateOption) {
				res = resid;
				date = dateOption;
			}

		}
	});
