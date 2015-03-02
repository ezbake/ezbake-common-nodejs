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

function EncryptionUtil(encryptionImplementation) {
  this.logger = require('winston');
  this.implConstants = require('../implConstants.json');
  if (!_.isNull(encryptionImplementation) && !_.isUndefined(encryptionImplementation) &&
    encryptionImplementation.isEncryptionImplementation) {
    this.encryptionImplementation = encryptionImplementation;
  }
}

/**
 * Tests whether passed in value is encrypted based on pre and postfixes set in implConstants file
 * @param value - string being checked to determine if it is encrypted
 * @returns {*|boolean} -true if is an encrypted string else false
 */
EncryptionUtil.prototype.isEncrypted = function(value) {
  var startsWith = new RegExp(this.implConstants.ENCRYPTED_VALUE_PREFIX_REGEX);
  var endsWith = new RegExp(this.implConstants.ENCRYPTED_VALUE_POSTFIX_REGEX);
  return _.isString(value) && startsWith.test(value) && endsWith.test(value);
};

EncryptionUtil.prototype.encryptValue = function(value) {
  if (!this.isImplemented()) {
    return value;
  }
  var encryptedValue = this.encryptionImplementation.encrypt(value);
  return this._wrapEncryptedValue(encryptedValue);
};

EncryptionUtil.prototype.decryptValue = function(value) {
  if (!this.isImplemented()) {
    return value;
  }
  var encryptedValue = this._unwrapEncryptedValue(value);
  return this.encryptionImplementation.decrypt(encryptedValue);
};

EncryptionUtil.prototype.isImplemented = function() {
  return !_.isNull(this.encryptionImplementation) && !_.isUndefined(this.encryptionImplementation);
};

EncryptionUtil.prototype._wrapEncryptedValue = function(value) {
  return this.implConstants.ENCRYPTED_VALUE_PREFIX + value + this.implConstants.ENCRYPTED_VALUE_POSTFIX;
};

EncryptionUtil.prototype._unwrapEncryptedValue = function(value) {
  return value.substring(this.implConstants.ENCRYPTED_VALUE_PREFIX.length,
    value.length - this.implConstants.ENCRYPTED_VALUE_POSTFIX.length);
};

module.exports = EncryptionUtil;