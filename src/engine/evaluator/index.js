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

// @flow

'use strict';

const engine = require('../engine');
const engineUtils = require('../engine/utils');
const keyParser = require('../../utils/key/parser');
const thenable = require('../../utils/promise/thenable');

// Build Evaluation object if and only if matchingResult is true
function match(matchingResult: boolean, bucketingKey: string, seed: number, treatments: Treatments, label: string): ?Evaluation {
  if (matchingResult) {
    const treatment = engine.getTreatment(bucketingKey, seed, treatments);

    return {
      treatment,
      label
    };
  }

  // else we should notify the engine to continue evaluating
  return undefined;
}

// Evaluator factory
function evaluatorContext(matcherEvaluator: Function, treatments: Treatments, label: string, conditionType: string): Function {

  function evaluator(key: SplitKey, seed: number, trafficAllocation: number, trafficAllocationSeed: number, attributes: ?Object): Promise<?Evaluation> | ?Evaluation {
    // the key could be a string or KeyDTO it should return a keyDTO.
    const {
      matchingKey,
      bucketingKey
    } = keyParser(key);

    // Whitelisting has more priority than traffic allocation, so we don't apply this filtering to those conditions.
    // For rollout, if traffic allocation for splits is 100, we don't need to filter it because everything should evaluate the rollout.
    if (conditionType === 'ROLLOUT' && trafficAllocation < 100) {
      const bucket = engineUtils.bucket(bucketingKey, trafficAllocationSeed);

      if (bucket >= trafficAllocation) {
        return;
      }
    }

    // matcherEvaluator could be Async, this relays on matchers return value, so we need
    // to verify for thenable before play with the result
    const matches = matcherEvaluator(matchingKey, attributes);

    if (thenable(matches)) {
      return matches.then(result => match(result, bucketingKey, seed, treatments, label));
    }

    return match(matches, bucketingKey, seed, treatments, label);
  }

  return evaluator;
}

module.exports = evaluatorContext;
