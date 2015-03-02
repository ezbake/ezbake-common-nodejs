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

var assert = require('should');
var EncryptionUtil = require('../lib').utilities.EncryptionUtil;
var encryptionImplementation = require('../lib').utilities.encryptionImplementations.PBEWithMD5AndDES;

var testPassword = "password";

describe('Encryption', function(){
  it('should read "ENC~(value)~" as encrypted', function(){
    var ei = new encryptionImplementation(testPassword);
    var enc = new EncryptionUtil(ei);
    enc.isEncrypted("ENC~(value)~").should.be.true;
  });

  it('should read "FOOENC~(value)FOO" as not encrypted', function(){
    var ei = new encryptionImplementation(testPassword);
    var enc = new EncryptionUtil(ei);
    enc.isEncrypted("FOOENC~(value)FOO").should.be.false;
  });

  it('should read "ENC~(value" as not encrypted', function(){
    var ei = new encryptionImplementation(testPassword);
    var enc = new EncryptionUtil(ei);
    enc.isEncrypted("ENC~(value").should.be.false;
  });

  it('should read "(value)" as not encrypted', function(){
    var ei = new encryptionImplementation(testPassword);
    var enc = new EncryptionUtil(ei);
    enc.isEncrypted("(value)").should.be.false;
  });

  it('should read "value)" as not encrypted', function(){
    var ei = new encryptionImplementation(testPassword);
    var enc = new EncryptionUtil(ei);
    enc.isEncrypted("value)").should.be.false;
  });

  it('should encrypt the value foo to ENC~(uZmGXbIofro=)~', function(){
    var ei = new encryptionImplementation(testPassword);
    var enc = new EncryptionUtil(ei);
    var encryptedValue = enc.encryptValue('foo');
    enc.isEncrypted(encryptedValue).should.be.true;
    encryptedValue.should.equal('ENC~(uZmGXbIofro=)~')
  });
  it('should decrypt the value ENC~(uZmGXbIofro=)~ to foo', function(){
    var ei = new encryptionImplementation(testPassword);
    var enc = new EncryptionUtil(ei);
    var decryptedValue = enc.decryptValue('ENC~(uZmGXbIofro=)~');
    enc.isEncrypted(decryptedValue).should.be.false;
    decryptedValue.should.equal('foo')
  });
});

describe('pbewithmd5anddes', function(){
  it('should encrypt foo to uZmGXbIofro=', function(){
    var ei = new encryptionImplementation(testPassword);
    var value = ei.encrypt('foo');
    value.should.equal('uZmGXbIofro=');
  });

  it('should decrypt uZmGXbIofro= to foo', function(){
    var ei = new encryptionImplementation(testPassword);
    var value = ei.decrypt('uZmGXbIofro=');
    value.should.equal('foo');
  });

  it('should encrypt KingOfTheNorth to eitre2mNCN+VVR5aN4EIhg==', function(){
    var ei = new encryptionImplementation(testPassword);
    var value = ei.encrypt('KingOfTheNorth');
    value.should.equal('eitre2mNCN+VVR5aN4EIhg==');
  });

  it('should decrypt eitre2mNCN+VVR5aN4EIhg== to KingOfTheNorth', function(){
    var ei = new encryptionImplementation(testPassword);
    var value = ei.decrypt('eitre2mNCN+VVR5aN4EIhg==');
    value.should.equal('KingOfTheNorth');
  });
})