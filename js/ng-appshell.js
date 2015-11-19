(function(app) {
  'use strict';

  app.directive('appshellInclude', function($compile, $localStorage, $http) {
    return {
      restrict: 'A',

      controller: function($scope, $element, $attrs) {
        var href = $attrs.appshellInclude;
        var group = $attrs.appshellGroup;

/**/
delete $localStorage[group];
/**/

        if ($localStorage[group] && $localStorage[group].body) {
//console.log($localStorage[group]);

          $element.append(
            $compile($localStorage[group].body)($scope)
          );
        }
        else {
          $localStorage[group] = {
            body: '',
            images: {}
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

  app.directive('appshellSrc', function($localStorage) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var src = attrs.appshellSrc;
        var group = attrs.appshellGroup;

        if ($localStorage[group].images[src])
          element.attr({ src: $localStorage[group].images[src] });
        else {
          element.one('load', function() {
            var unadulturatedImg = new Image();

            unadulturatedImg.onload = function() {
              // convert img element into data URL, via:
              // https://hacks.mozilla.org/2012/02/saving-images-and-files-in-localstorage/
              var imgCanvas = document.createElement('canvas'),
                  imgContext = imgCanvas.getContext('2d');

              // Make sure canvas is as big as the picture
              imgCanvas.width = this.width;
              imgCanvas.height = this.height;

              // Draw image into canvas element
              imgContext.drawImage(this, 0, 0, this.width, this.height);

              // Get canvas contents as a data URL
              var dataUrl = imgCanvas.toDataURL('image/png');

              // now store the data URL by mapping it with the true src
              $localStorage[group].images[src] = dataUrl;
            };

            unadulturatedImg.src = this.src;
          });

          // now insert the true src so the image can load
          element.attr({ src: src });
        }
      }
    };
  });
})(angular.module('ngAppShell', ['ngStorage']));
