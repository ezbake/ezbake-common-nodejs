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

var _ = require('lodash-node');
var logger = require('winston');
var implConstants = require('./implConstants.json');
var EncryptionUtility = require('./utils/encryptionUtil');
var EncryptionImplementation = require('./utils/pbewithmd5anddes');

function EzConfiguration() {
  var _this = this; //when using lodash, this becomes overrided
  _this.loaders = [];
  _this.properties = {};
  _.each(arguments, function(loader) {
    if (loader.isEzConfigurationLoader && loader.isLoadable()) {
      _this.loaders.push(loader);
    }
  });
  if (this.loaders.length === 0) {
    logger.info('No loadable EzConfigurationLoaders were give to EzConfiguration.  Loading default loaders');
    var DirectoryConfigurationLoader = require('./loaders/directoryConfigurationLoader');
    var dcl = new DirectoryConfigurationLoader();
    _this.loaders.push(dcl);
    var OpenShiftConfigurationLoader = require('./loaders/openShiftConfigurationLoader');
    var oscl = new OpenShiftConfigurationLoader();
    _this.loaders.push(oscl);
  }
  _this._loadLoaders();
}

EzConfiguration.prototype.getProperties = function() {
  return this.properties;
};

EzConfiguration.prototype.getBoolean = function(key, defaultValue) {
  defaultValue = isNullOrUndefined(defaultValue) ? false : !!defaultValue;
  var value = this.properties[key];
  if (isNullOrUndefined(value)) {
    return defaultValue;
  }
  return value.trim().toString().toLowerCase() === defaultValue.toString().toLowerCase() ? defaultValue : !defaultValue;
};

EzConfiguration.prototype.getNumber = function(key, defaultValue) {
  var value = this.properties[key];
  if (isNullOrUndefined(value)) {
    return defaultValue;
  }
  var retValue = parseFloat(value);
  return _.isNaN(retValue) ? defaultValue : retValue;
};

EzConfiguration.prototype.getObject = function(key, defaultValue) {
  var value = this.properties[key];
  if (isNullOrUndefined(value)) {
    return defaultValue;
  }
  if (_.isObject(value)) {
    return value;
  }
  if (_.isString(value)) {
    try {
      return JSON.parse(value);
    } catch (ignored) { //unable to parse string into JSON return default
      return defaultValue;
    }
  }
  return defaultValue;//not undefined or an object or a string, return default
};

EzConfiguration.prototype.getString = function(key, defaultValue) {
  var value = this.properties[key];
  if (isNullOrUndefined(value)) {
    return defaultValue;
  }
  return value.toString();
};

EzConfiguration.prototype._loadLoaders = function() {
  var _this = this; //when using lodash, this becomes overridden
  var encryptedKeys = [];
  _.each(_this.loaders, function(loader) {
    if (loader.isLoadable()) {
      _.extend(_this.properties, loader.loadConfiguration());
      encryptedKeys = _.union(encryptedKeys, loader._encryptedKeys);
    }
  });
  this._decryptValues(encryptedKeys);
};

EzConfiguration.prototype._decryptValues = function(encryptedKeys) {
  if (_.isEmpty(encryptedKeys)) {
    return;
  }
  var envKey = this.properties[implConstants.EZBAKE_SHARED_SECRET_ENVIRONMENT_VARIABLE];
  if (_.isEmpty(envKey)) {
    return;
  }
  var sharedSecret = process.env[envKey];
  if (_.isEmpty(sharedSecret)) {
    return;
  }
  var encryptImpl = new EncryptionImplementation(sharedSecret);
  var encryptionUtil = new EncryptionUtility(encryptImpl);
  var _self = this;
  _.each(encryptedKeys, function(key) {
    if (!_.isEmpty(_self.properties[key]) && encryptionUtil.isEncrypted(_self.properties[key])) {
      _self.properties[key] = encryptionUtil.decryptValue(_self.properties[key]);
    }
  });
};

var isNullOrUndefined = function(value) {
  return _.isUndefined(value) || _.isUndefined(value);
};

module.exports = EzConfiguration;