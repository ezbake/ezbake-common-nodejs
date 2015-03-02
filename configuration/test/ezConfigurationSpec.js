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
var EzConfiguration = require('../lib').EzConfiguration;
var DirectoryConfigurationLoader = require('../lib').loaders.DirectoryConfigurationLoader;
var _ = require('lodash-node');
var dcl = new DirectoryConfigurationLoader(__dirname + '/ezConfigTestProperties');

describe('EzConfiguration', function(){
  it('should load properties from loader', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.size(ec.getProperties()) > 0, 'Expected the properties to contain items');
  });

  it('should return true for getBoolean for a valid true key and no default', function(){
    var ec = new EzConfiguration(dcl);
    ec.getBoolean('bool.true.value').should.be.true;
  });

  it('should return true for getBoolean for a valid true key with false default', function(){
    var ec = new EzConfiguration(dcl);
    ec.getBoolean('bool.true.value', false).should.be.true;
  });

  it('should return false for getBoolean for a valid false key with no default', function(){
    var ec = new EzConfiguration(dcl);
    ec.getBoolean('bool.false.value').should.be.false;
  });

  it('should return false for getBoolean for a valid false key with true default', function(){
    var ec = new EzConfiguration(dcl);
    ec.getBoolean('bool.false.value', true).should.be.false;
  });

  it('should return false for getBoolean with invalid key and no default', function(){
    var ec = new EzConfiguration(dcl);
    ec.getBoolean('invalid.bool.true.value').should.be.false;
  });

  it('should return false for getBoolean with invalid key and false default', function(){
    var ec = new EzConfiguration(dcl);
    ec.getBoolean('invalid.bool.true.value', false).should.be.false;
  });

  it('should return true for getBoolean with invalid key and true default', function(){
    var ec = new EzConfiguration(dcl);
    ec.getBoolean('invalid.bool.true.value', true).should.be.true;
  });

  it('should return a number for getNumber from a property with a number value', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isNumber(ec.getNumber('number.value')), 'getNumber did not return a number');
    assert.equal(ec.getNumber('number.value'), 10.5);
  });

  it('should return the properties number back for getNumber from a property with a number value when default given', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isNumber(ec.getNumber('number.value',1)), 'getNumber did not return a number');
    assert.equal(ec.getNumber('number.value',1), 10.5);
  });

  it('should return the undefined back for getNumber from an invalid property key with no default given', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isUndefined(ec.getNumber('invalid.number.value')), 'getNumber did not return undefined for an invalid key with no default');
  });

  it('should return the default back for getNumber from an invalid property key with a default given', function(){
    var ec = new EzConfiguration(dcl);
    assert.equal(ec.getNumber('invalid.number.value', 5), 5, 'getNumber did not return the default value for an invalid key with a default');
  });

  it('should return an object when getObject is called for a key with an object as its value', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isObject(ec.getObject('object.value')), 'expected getObject to return an object for the key object.value');
  });

  it('should return undefined when getObject is called for an invalid key', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isUndefined(ec.getObject('invalid.object.value')), 'expected getObject to return undefined for an invalid object key');
  });

  it('should return an object when getObject is called for an invalid key with an object as its default', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isObject(ec.getObject('invalid.object.value', {})), 'expected getObject to return an object for the invalid key with a default object');
  });

  it('should return a string when getString is called on a string valid key', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isString(ec.getString('string.value')), 'expected getString to return a string for the key string.value');
  });

  it('should return the properties string when getString is called on a string valid key with a default given', function(){
    var ec = new EzConfiguration(dcl);
    assert.equal(ec.getString('string.value', 'default'), 'this is a string');
  });

  it('should return a string when getString is called on a number valid key', function(){
    var ec = new EzConfiguration(dcl);
    assert.ok(_.isString(ec.getString('number.value')), 'expected getString to return a string for the key number.value');
  });

  it('should return the default string when getString is called on an invalid key with a default given', function(){
    var ec = new EzConfiguration(dcl);
    assert.equal(ec.getString('invalid.string.value', 'default'), 'default');
  });

  it('should return the encrypted value of an encrypted property if the password is not set in the environment', function(){
    var ec = new EzConfiguration(dcl);
    var encryptedValue = ec.getString('encrypted.value');
    assert.equal(encryptedValue, 'ENC~(uZmGXbIofro=)~');
  });

  it('should return the decrypted value of an encrypted property if the password is set in the environment', function(){
    process.env['test_password'] = 'password';
    var ec = new EzConfiguration(dcl);
    var encryptedValue = ec.getString('encrypted.value');
    assert.equal(encryptedValue, 'foo');
  });

});