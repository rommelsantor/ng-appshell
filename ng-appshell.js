(function(app) {
  'use strict';

  app.directive('appshellInclude', function($compile, $localStorage, $http) {
    return {
      restrict: 'A',

      controller: function($scope, $element, $attrs) {
        var group = $attrs.appshellGroup;

        if (!group)
          return;

        var href = $attrs.appshellInclude;
        var nowTime = Math.floor(new Date().getTime() / 1000);

        if ($localStorage[group] && $localStorage[group].body && $localStorage[group].expireTime >= nowTime) {
          console && console.log('[ng-appshell]', 'Loading shell from local storage');

          // preload images by url
          angular.forEach($localStorage[group].images, function(src) {
            var img = new Image();
            img.src = src;
          });

          // load cached HTML
          $element.append(
            $compile($localStorage[group].body)($scope)
          );
        }
        else {
          console && console.log('[ng-appshell]', 'Fetching fresh shell over the network');

          var maxSecs = parseInt($attrs.appshellLifetime) || 0;

          $localStorage[group] = {
            body: '',
            images: [],
            lifetime: maxSecs,
            expireTime: maxSecs ? (nowTime + maxSecs) : 0
          };
          
          $http({
            method: 'GET',
            url: href
          })
          .then(
            function success(response) {
              // store the raw template as provided
              $localStorage[group].body = response.data;

              // compile the template, storing along the way any images as data URLs
              // and replace the processed DOM elements into the container
              $element.append(
                $compile(response.data)($scope)
              );
            },
            function failure(response) {
              // TODO: handle errors
            }
          );
        }
      }
    };
  });

  app.directive('appshellImage', function($localStorage, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function(){// give CSS a chance to be applied (for bg img)
          var group = attrs.appshellGroup;

          if (!group)
            return;

          // save src of <img> tag
          if (element.prop('tagName') === 'IMG')
            $localStorage[group].images.push(attrs.src);
          // otherwise assume/hope it has a background-image url
          else {
            var bgImg = element.css('background-image');
            if (/url\((.+)\)/.test(bgImg))
              $localStorage[group].images.push(RegExp.$1);
          }
        });
      }
    };
  });
})(angular.module('ngAppShell', ['ngStorage']));
