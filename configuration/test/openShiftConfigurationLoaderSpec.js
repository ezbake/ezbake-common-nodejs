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
var implConstants = require('../lib/implConstants.json');

var OpenShiftConfigurationLoader = require('../lib').loaders.OpenShiftConfigurationLoader;
var _ = require('lodash-node');
var propertiesDirectory = __dirname + '/ezConfigTestProperties';

describe('OpenShiftConfigurationLoaderSpec', function() {
  it('should be an EzConfigurationLoader', function() {
    var oscl = new OpenShiftConfigurationLoader();
    oscl.isEzConfigurationLoader.should.be.true;
  });

  it('should not be loadable if no open shift env variable is set', function() {
    process.env[implConstants.OPENSHIFT_REPO_DIR_ENV_VAR] = undefined;
    var oscl = new OpenShiftConfigurationLoader();
    oscl.isLoadable().should.be.false;
  });

  it('should be loadable if an open shift env variable is set', function() {
    process.env[implConstants.OPENSHIFT_REPO_DIR_ENV_VAR] = propertiesDirectory;
    var oscl = new OpenShiftConfigurationLoader();
    oscl.isLoadable().should.be.true;
  });

  it('should return a hash of properties on loadConfiguration', function() {
    var oscl = new OpenShiftConfigurationLoader();
    _.isObject(oscl.loadConfiguration()).should.be.true;
  });

  it('should override entries with the last file read', function() {
    var oscl = new OpenShiftConfigurationLoader();
    oscl.loadConfiguration()['stark.ned'].should.equal('Warden of the North');
  });

  it('should skip files that do not end in ".properties"', function() {
    var oscl = new OpenShiftConfigurationLoader();
    assert.ok(oscl.loadConfiguration()['skip.this.property'] === undefined,
      'skip.this.property should not have been read');
  });

  it('should return encrypted value of an encrypted property', function() {
    var oscl = new OpenShiftConfigurationLoader(propertiesDirectory);
    oscl.loadConfiguration()['encrypted.value'].should.equal('ENC~(uZmGXbIofro=)~');
  });
});