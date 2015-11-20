(function() {
  'use strict';

  angular.module('AppShellDemo', ['ngAppShell']);
})();

(function(app) {
  'use strict';

  app.service('url', function() {
    var pathRoot = ($('base').attr('href').replace(/\/$/, '') || '') + '/';

    this.create = function(subPath) {
      return pathRoot + subPath.replace(/^\//, '');
    };

    this.createTemplate = function(subPath) {
      return pathRoot + 'tpl/' + subPath.replace(/^\//, '');
    };

    this.$get = function() {
    };
  });
})(angular.module('AppShellDemo'));

(function(app) {
  'use strict';

  app.controller('MainController', function() {
  });

  app.controller('IndexController', function($scope, $http, $compile, url, $timeout) {
    $timeout(function(){// simulate a latent network request (for a large page)
      $http({
        method: 'GET',
        url: url.createTemplate('index.html')
      })
      .then(
        function success(response) {
          $('#index-content').addClass('loaded').append(
            $compile(response.data)($scope)
          );
        }
      );
    }, 2000);
  });
})(angular.module('AppShellDemo'));
