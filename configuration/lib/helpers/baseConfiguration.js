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

function BaseConfiguration(ezConfiguration, namespace) {
  this.ezConfiguration = ezConfiguration;
  this.namespace = namespace;
  this.constants = require('..').constants;
}

/**
 * Gets a string from ezConfiguration
 * @param key - a key stored in ezConfiguration of type String
 * @return string value of configred key; undefined otherwise.
 */
BaseConfiguration.prototype.get = function(key) {
  if (!_validState(this) || !_validKey(key)) {
    return undefined;
  }
  return this.ezConfiguration.getProperties()[this._parseKey(key)];
};


/**
 * parse the key
 * @param key - a key stored in ezconfiguration
 * @return the parsed key.
 */
BaseConfiguration.prototype._parseKey = function(key) {
  return !!this.namespace ? this.namespace + '.' + key : key;
};


/**
 * Gets a boolean from ezConfiguration
 * @param key - a key stored in ezConfiguration of type boolean
 * @return boolean value of configured key; undefined otherwise.
 */
BaseConfiguration.prototype.getBoolean = function(key) {
  if (!_validState(this) || !_validKey(key)) {
    return undefined;
  }
  return this.ezConfiguration.getBoolean(this._parseKey(key));
}

/**
 * Gets a number from ez configuration
 * @param key - a key stored in ezConfiguration of type number
 * @return number of configured key; undefined otherwise.
 */
BaseConfiguration.prototype.getNumber = function(key) {
  if (!_validState(this) || !_validKey(key)) {
    return undefined;
  }
  return this.ezConfiguration.getNumber(this._parseKey(key));
}

/**
 * Determine if the base configuration is in a valid state
 * i.e. ezConfiguration is defined not null and has a function getProperties.
 * @return true if the state is valid, false otherwise.
 */
function _validState(self) {
  return !(_.isUndefined(self.ezConfiguration) || _.isNull(self.ezConfiguration) ||
  !_.isFunction(self.ezConfiguration.getProperties));
}

/**
 * Determine if the key is valid
 * @param key - key to look up in configuration
 * @return true if the key is valid, false otherwise.
 */
function _validKey(key) {
  return !(_.isUndefined(key) || _.isNull(key));
}

module.exports = BaseConfiguration;
