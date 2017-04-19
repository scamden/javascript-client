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

'use strict';

const log = require('debug')('splitio-engine:matcher');
const intersection = require('lodash/intersection');

function containsAnyMatcherContext(ruleAttr /*: array */) /*: Function */ {
  return function containsAnyMatcher(runtimeAttr /*: array */) /*: boolean */ {
    const containsAny = intersection(runtimeAttr, ruleAttr).length > 0;

    log(`[containsAnyMatcher] ${runtimeAttr} contains at least an element of ${ruleAttr}? ${containsAny}`);

    return containsAny;
  };
}

module.exports = containsAnyMatcherContext;
