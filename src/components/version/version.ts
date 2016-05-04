'use strict';

angular.module('ngShell.version', [
  'ngShell.version.interpolate-filter',
  'ngShell.version.version-directive'
])

.value('version', '0.1');
