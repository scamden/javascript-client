'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
Copyright 2016 Split Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/

var settings = require('@splitsoftware/splitio-utils/lib/settings');
var SchedulerFactory = require('@splitsoftware/splitio-utils/lib/scheduler');

var _require = require('@splitsoftware/splitio-cache');

var splitChangesUpdater = _require.splitChangesUpdater;
var segmentsUpdater = _require.segmentsUpdater;


function scheduler() {
  var coreSettings = settings.get('core');
  var featuresRefreshRate = settings.get('featuresRefreshRate');
  var segmentsRefreshRate = settings.get('segmentsRefreshRate');

  var splitRefreshScheduler = SchedulerFactory();
  var segmentsRefreshScheduler = SchedulerFactory();

  // Fetch Splits and Segments in parallel (there is none dependency between
  // Segments and Splits)
  return _promise2.default.all([splitRefreshScheduler.forever(splitChangesUpdater, featuresRefreshRate, coreSettings), segmentsRefreshScheduler.forever(segmentsUpdater, segmentsRefreshRate, coreSettings)]).then(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 1);

    var storage = _ref2[0];

    return storage;
  });
}

module.exports = scheduler;