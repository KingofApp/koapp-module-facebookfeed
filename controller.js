angular
  .controller('facebookFeedCtrl', loadFunction);

loadFunction.$inject = ['$http', '$scope', 'structureService', '$filter', '$location'];

function loadFunction($http, $scope, structureService, $filter, $location) {
  //Register upper level modules
  structureService.registerModule($location, $scope, 'facebookfeed');

  var moduleConfig = angular.copy($scope.facebookfeed.modulescope);

  $scope.visualization = moduleConfig.visualization || 'card';

  $http.get('https://graph.facebook.com/v2.4/' + moduleConfig.pageid + '/posts', {
    params: {
      access_token: moduleConfig.accesstoken,
      fields: 'object_id,message,link,full_picture,caption,updated_time,from'
    }
  })
  .success(function(data) {
    $scope.facebookfeed.items = prepareData(data.data);
  }).error(function() {
    $scope.facebookfeed.message = $filter('translate')('facebookfeed.feed.error');
  });

  function prepareData(data) {
    angular.forEach(data, function(post) {
      post.updated_time = moment(post.updated_time).format($filter('translate')('facebookfeed.dateFormat'));
    });
    return data;
  }

}
