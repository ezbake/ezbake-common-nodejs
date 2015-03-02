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

var PropertiesConfigurationLoader = require('../lib').loaders.PropertiesConfigurationLoader;
var _ = require('lodash-node');

describe('PropertiesConfigurationLoader', function() {
  it('should be an EzConfigurationLoader', function() {
    var pcl = new PropertiesConfigurationLoader();
    pcl.isEzConfigurationLoader.should.be.true;
  });

  it('should not be loadable if no properties and no encryption implementation were passed in', function() {
    var pcl = new PropertiesConfigurationLoader();
    pcl.isLoadable().should.be.false;
  });

  it('should be loadable if only properties were passed in', function() {
    var pcl = new PropertiesConfigurationLoader({foo: 'bar'});
    pcl.isLoadable().should.be.true;
  });

  it('should return a hash of properties on loadConfiguration', function() {
    var pcl = new PropertiesConfigurationLoader({foo: 'bar'});
    _.isObject(pcl.loadConfiguration()).should.be.true;
    assert.equal(_.size(pcl.loadConfiguration()), 1);
  });

  it('should return encrypted value of a property that was encrypted', function() {
    var pcl = new PropertiesConfigurationLoader({'encrypted.value': 'ENC~(uZmGXbIofro=)~'});
    pcl.loadConfiguration()['encrypted.value'].should.equal('ENC~(uZmGXbIofro=)~');
  });
});