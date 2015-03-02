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

var EzConfigurationLoader = require('./ezConfigurationLoader');
var fs = require('fs');
var path = require("path");
var _ = require('lodash-node');

DirectoryConfigurationLoader.prototype = new EzConfigurationLoader();
DirectoryConfigurationLoader.prototype.constructor = DirectoryConfigurationLoader;
function DirectoryConfigurationLoader(directory) {
  EzConfigurationLoader.call(this);
  if (_.isString(directory)) {
    this.dir = directory;
  } else {
    this.dir =
      process.env[this.implConstants.EZCONFIGURATION_ENV_VAR] || this.implConstants.EZCONFIGURATION_DEFAULT_DIR;
  }
  this.logger.debug('Loading Directory Configuration Loader with directory: ' + this.dir);
}

DirectoryConfigurationLoader.prototype.loadConfiguration = function() {
  var _this = this; //when using lodash, this becomes overridden
  var propFileRegex = new RegExp(_this.implConstants.PROPERTY_FILE_REGEX);
  var propertySplitRegex = new RegExp(_this.implConstants.SPLIT_ON_FIRST_EQUALS_REGEXP);

  // Get all properties files from the directory
  var files = fs.readdirSync(_this.dir).filter(function(val) {
    return propFileRegex.test(val);
  });
  _.each(files, function(file) {
    var fp = path.join(_this.dir, file);
    if (fs.existsSync(fp)) {
      var file = fs.readFileSync(fp, {encoding: "utf8"});
      _.each(file.split("\n"), function(lineInput) {
        var entry = lineInput.match(propertySplitRegex);
        if (_.isArray(entry) && (entry.length > 1)) {
          _this._setProperty(entry[1], entry[2]); //first entry is the full string value, ignore it
        }
      });
    } else {
      _this.logger.warn("DirectoryConfigurationLoader: File Path: " + fp + ", does not exists.");
    }
  });
  return _this.properties;
};

DirectoryConfigurationLoader.prototype.isLoadable = function() {
  var dirExists = !_.isUndefined(this.dir) && !_.isNull(this.dir) && fs.existsSync(this.dir);
  this.logger.debug('Is Directory Configuration Loader loadable: ' + dirExists);
  return dirExists;
};

module.exports = DirectoryConfigurationLoader;