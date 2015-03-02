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

describe('Thrift Configuration', function() {

    it('should load properties from data file', function() {
        var config = new NoZConfig('config');
        config.get("thrift.server.mode").should.equal("ThreadedPool");
    });

    it('should recognize whether a given thrift uses SSL', function() {
        var config = new NoZConfig('config');
        config.get("thrift.use.ssl").should.equal(false);
    });

    // RWP: extra test for checking whether falsy property values function correctly when default is true.
    it('should set client idle state to false from properties, when default is true', function() {
        // create config object with all defaults set
        var config = new NoZConfig(true);
        config.get("thrift.test.clients.while.idle").should.equal(true);

        // create config object with a single false property
        config = new NoZConfig({"thrift.test.clients.while.idle": false});
        config.get("thrift.test.clients.while.idle").should.equal(false);
    });


});
