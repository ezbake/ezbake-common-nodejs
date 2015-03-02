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
var constants = require("..").constants;
var EzConfiguration = require("../lib");
var zkKey = constants.ZOOKEEPER_CONNECTION_STRING;
var properties = {};
properties[zkKey] = 'localhost:2080';
var PropertyLoader = new EzConfiguration.loaders.PropertiesConfigurationLoader(properties);

var ezConfig = new EzConfiguration.EzConfiguration(PropertyLoader);


describe('EzConfiguration', function() {
  it('should return the zookeeper connection string key when getConnectionString is called', function() {
    var zookeeperHelper = new EzConfiguration.helpers.ZookeeperConfiguration(ezConfig);
    zookeeperHelper.getConnectionString().should.equal('localhost:2080');
  })
});
