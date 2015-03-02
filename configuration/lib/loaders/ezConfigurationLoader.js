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

var EncryptionUtil = require('../utils/encryptionUtil');

function EzConfigurationLoader() {
  this.logger = require('winston');
  this.implConstants = require('../implConstants.json');
  this.properties = {};
  this._encryptionUtil = new EncryptionUtil();//create default util to determine if a key is encrypted.
  this._encryptedKeys = [];
}

EzConfigurationLoader.prototype.loadConfiguration = function() {
  logger.error('loadConfiguration has not been implemented');
  throw 'loadConfiguration has not been implemented.';
};

EzConfigurationLoader.prototype.isLoadable = function() {
  logger.error('isLoadable has not been implemented');
  return false;
};

// This is used to by ezConfiguration to determine it is a loader
EzConfigurationLoader.prototype.isEzConfigurationLoader = true;

EzConfigurationLoader.prototype._setProperty = function(key, value) {
  if (key.indexOf('#') === 0) {
    return;
  } //line is a comment ignore it.

  if (this._encryptionUtil.isEncrypted(value)) {
    this._encryptedKeys.push(key);
  }
  this.properties[key] = value;
  this.logger.debug('Loaded property from file: key="' + key + '", value="' + this.properties[key] + '"');
};

module.exports = EzConfigurationLoader;