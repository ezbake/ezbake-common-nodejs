/*   Copyright (C) 2013-2014 Computer Sciences Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

/**
 * @author Gary Drocella
 * @date 02/11/15
 * Time 12:42PM
 */

var _ = require("lodash"),
    path = require("path");

/**
 * @return true if running inside an open shift container, false otherwise.
 */

function isInOpenShiftContainer() {
   var v = _isValid(process.env.OPENSHIFT_REPO_DIR);
   return v;
}

exports.isInOpenShiftContainer = isInOpenShiftContainer; 

/**
 * @return config dir of repo, that is, if running inside an openshift container, false otherwise.
 */
function getConfigurationDir() {
   var repoDir = exports.getRepoDir();
   var ezbakeConfigDir = "config";

   if(!_isValid(repoDir)) {
      return undefined;
   }

   return path.normalize(repoDir + path.sep + ezbakeConfigDir);
}

exports.getConfigurationDir = getConfigurationDir;

/**
 * @return repo dir of environment variable, undefined otherwise.
 */
function getRepoDir() {
   var repoDir = process.env.OPENSHIFT_REPO_DIR;
   if(!_isValid(repoDir)) {
      return undefined;
   }

   return repoDir;
}

exports.getRepoDir = getRepoDir; 

 
 /**
  * Determines if value is valid, i.e. value
  * is not null or undefined.
  * @param v - value to determine if valid
  * @return true if value is valid, false otherwise.
  */
function _isValid(v) {
	return !_.isNull(v) && !_.isUndefined(v);
}