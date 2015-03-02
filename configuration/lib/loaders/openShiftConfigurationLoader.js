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

var DirectoryConfigurationLoader = require('./directoryConfigurationLoader');
var _ = require('lodash-node');
var fs = require('fs');
var path = require('path');

OpenShiftConfigurationLoader.prototype = new DirectoryConfigurationLoader();
OpenShiftConfigurationLoader.prototype.constructor = OpenShiftConfigurationLoader;

function OpenShiftConfigurationLoader() {
  DirectoryConfigurationLoader.call(this);
  var openshiftDirectory = process.env[this.implConstants.OPENSHIFT_REPO_DIR_ENV_VAR];
  if (_.isString(openshiftDirectory)) {
    this.dir = path.join(openshiftDirectory, "config/");
  }
  this.logger.debug('Loading Open Shift Configuration Loader with directory: ' + this.dir);
}

OpenShiftConfigurationLoader.prototype.isLoadable = function() { //overridden to update debug message
  var dirExists = !_.isUndefined(this.dir) && !_.isNull(this.dir) && fs.existsSync(this.dir);
  this.logger.debug('Is Open Shift Configuration Loader loadable: ' + dirExists);
  return dirExists;
};

module.exports = OpenShiftConfigurationLoader;
