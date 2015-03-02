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

function EncryptionImplementation(){
  this.logger = require('winston');
}

EncryptionImplementation.prototype.encrypt = function(){
  this.logger.error('Encrypt has not been implemented.');
  throw 'Unimplemented method: encrypt';
};
EncryptionImplementation.prototype.decrypt = function(){
  this.logger.error('Decrypt has not been implemented.');
  throw 'Unimplemented method: decrypt';
};
EncryptionImplementation.prototype.isEncryptionImplementation = true;

module.exports = EncryptionImplementation;