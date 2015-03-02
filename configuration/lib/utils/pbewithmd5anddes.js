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

/*
 * Emulates Java's PBEWITHMD5ANDDES for node.js
 */
var crypto = require('crypto');
var EncryptionImplementation = require('./encryptionImplementation');
var implConstants = require('../implConstants.json');

pbewithmd5anddes.prototype = new EncryptionImplementation();
pbewithmd5anddes.prototype.constructor = pbewithmd5anddes;

function pbewithmd5anddes(password) {
  EncryptionImplementation.call(this);
  this.password = password;
  this.salt = implConstants.DEFAULT_ENCRYPTION_SALT || "PLEASE SET A DEFAULT";
  this.saltSize = implConstants.DEFAULT_BYTES_FOR_SALT || 8;
  this.iterations = implConstants.DEFAULT_ENCRYPTION_ITERATIONS || 1000;
}

pbewithmd5anddes.prototype.encrypt = function(payload) {
  var kiv = getKeyIV(this.password, this.salt, this.iterations, this.saltSize);
  var cipher = crypto.createCipheriv('des', kiv[0], kiv[1]);
  var encrypted = [];
  encrypted.push(cipher.update(payload, 'utf-8', 'hex'));
  encrypted.push(cipher.final('hex'));
  return new Buffer(encrypted.join(''), 'hex').toString('base64');
};

pbewithmd5anddes.prototype.decrypt = function(payload) {
  var encryptedBuffer = new Buffer(payload, 'base64');
  var kiv = getKeyIV(this.password, this.salt, this.iterations, this.saltSize);
  var decipher = crypto.createDecipheriv('des', kiv[0], kiv[1]);
  var decrypted = [];
  decrypted.push(decipher.update(encryptedBuffer));
  decrypted.push(decipher.final());
  return decrypted.join('');
}

var KDF = function(password, salt, iterations, saltSize) {
  var pwd = new Buffer(password, 'utf-8');
  var slt = new Buffer(salt, 'utf-8').slice(0, saltSize);
  var key = Buffer.concat([pwd, slt]);
  var i;
  for (i = 0; i < iterations; i += 1) {
    key = crypto.createHash("md5").update(key).digest();
  }
  return key;
};

var getKeyIV = function(password, salt, iterations, saltSize) {
  var key = KDF(password, salt, iterations, saltSize);
  var keybuf = new Buffer(key, 'binary').slice(0, 8);
  var ivbuf = new Buffer(key, 'binary').slice(8, 16);
  return [keybuf, ivbuf];
};

module.exports = pbewithmd5anddes;