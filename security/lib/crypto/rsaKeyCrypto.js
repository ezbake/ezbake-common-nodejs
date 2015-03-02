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

var crypto = require("crypto");
var fs = require('fs');
var path = require('path');

/* Private Variables */
var KEY_ALGORITHM = "RSA";
var ALGORITHM = KEY_ALGORITHM + "-SHA256";
var CHARSET = "utf8";

/**
 * RSAKeyCrypto constructor
 *
 * @param directory optional directory from which to load keys
 * @param privKey if directory is present, expected to be filename relative to directory. otherwise expected to be the pem key
 * @param pubKey if directory is present, expected to be filename relative to directory. otherwise expected to be the pem key
 */
function RSAKeyCrypto(directory, privKey, pubKey) {
  var self = this;
  var loadDirectory = false;

  // Process the args
  if (typeof pubKey !== 'undefined') {
    // if 3 arguments passed, process as paths
    loadDirectory = true;
  } else {
    // shift the arguments
    pubKey = privKey;
    privKey = directory;
  }

  if (loadDirectory === true) {
    this.privateKey = fs.readFileSync(path.join(directory, privKey), CHARSET);
    this.publicKey = fs.readFileSync(path.join(directory, pubKey), CHARSET);
  } else {
    this.privateKey = privKey;
    this.publicKey = pubKey;
  }
};

RSAKeyCrypto.prototype.getPublicPEM = function() {
  return this.publicKey;
};

RSAKeyCrypto.prototype.getPrivatePEM = function() {
  return this.privateKey;
};

RSAKeyCrypto.prototype.setPrivateKey = function(priv) {
  this.privateKey = priv;
};

RSAKeyCrypto.prototype.hasPrivate = function() {
  return this.privateKey != null;
};

RSAKeyCrypto.prototype.hasPublic = function() {
  return this.publicKey != null;
};

RSAKeyCrypto.prototype.verify = function(data, signature) {
  var verifier = crypto.createVerify(ALGORITHM);
  verifier.update(data);
  return verifier.verify(this.publicKey, signature, "base64");
};

RSAKeyCrypto.prototype.sign = function(data) {
  var signer = crypto.createSign(ALGORITHM);
  signer.update(data);
  return signer.sign(this.privateKey, "base64");
};

exports = module.exports = RSAKeyCrypto;
