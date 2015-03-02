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
var NoZConfig = require('../lib').NoZConfig;

describe('Kafka Configuration', function() {

    it('should load properties from data file', function() {
        var config = new NoZConfig('test/testData');
        config.get("zk.connect").should.equal("host7:port");
        config.get("zookeeper.connect").should.equal("host8:port");
        config.get("metadata.broker.list").should.equal("host1:port1,host2:port2");
    });

    it('should recognize numeric properties', function() {
        var config = new NoZConfig('test/testData');
        config.get("consumer.timeout.ms").should.equal(1000);
    });

});
