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
var DirectoryConfigurationLoader = require('../lib').loaders.DirectoryConfigurationLoader;
var _ = require('lodash-node');
var propertiesDirectory = __dirname + '/ezConfigTestProperties';

describe('DirectoryConfigurationLoaderSpec', function(){
  it('should be an EzConfigurationLoader', function(){
    var dcl = new DirectoryConfigurationLoader();
    dcl.isEzConfigurationLoader.should.be.true;
  });

  it('should be loadable', function(){
    process.env['EZCONFIGURATION_DIR'] = propertiesDirectory;
    var dcl = new DirectoryConfigurationLoader();
    dcl.isLoadable().should.be.true;
  });

  it('should return a hash of properties on loadConfiguration', function(){
    var dcl = new DirectoryConfigurationLoader(propertiesDirectory);
    _.isObject(dcl.loadConfiguration()).should.be.true;
  });

  it('should override entries with the last file read', function(){
    var dcl = new DirectoryConfigurationLoader(propertiesDirectory);
    dcl.loadConfiguration()['stark.ned'].should.equal('Warden of the North');
  });

  it('should skip files that do not end in ".properties"', function(){
    var dcl = new DirectoryConfigurationLoader(propertiesDirectory);
    assert.ok(dcl.loadConfiguration()['skip.this.property'] === undefined, 'skip.this.property should not have been read');
  });

  it('should return encrypted value of an encrypted property', function(){
    var dcl = new DirectoryConfigurationLoader(propertiesDirectory);
    dcl.loadConfiguration()['encrypted.value'].should.equal('ENC~(uZmGXbIofro=)~');
  });

  it('should ignore comments keys/lines that start with: #', function(){
    var dcl = new DirectoryConfigurationLoader(propertiesDirectory);
    var properties = dcl.loadConfiguration();
    assert.equal(properties['stark.ned'], 'Warden of the North');
    assert.equal(properties['#test.prop'], undefined);
    assert.equal(properties['stark.rob'], 'King of the North');
  })
});
