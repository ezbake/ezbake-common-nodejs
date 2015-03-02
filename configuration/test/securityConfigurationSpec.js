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

describe('Security Configuration', function() {

    it('should load properties from data file', function() {
        var config = new NoZConfig('test/testData');
        config.get("ezbake.ssl.keystore.file").should.equal("application.p12");
        config.get("ezbake.ssl.keystore.type").should.equal("PKCS12");
        config.get("ezbake.ssl.keystore.pass").should.equal("password");

        config.get("ezbake.ssl.keystore.file.serviceName").should.equal("serviceName.jks");
        config.get("ezbake.ssl.keystore.type.serviceName").should.equal("JKS");
        config.get("ezbake.ssl.keystore.pass.serviceName").should.equal("mypassword");
    });

    it('should set cache type to memory if set from configuration parameters', function() {
        var config = new NoZConfig({"ezbake.security.cache.type": "MEMORY"});
        config.get("ezbake.security.cache.type").should.equal("MEMORY");
    });

    it('should set cache type to redis if set from configuration parameters', function() {
        var config = new NoZConfig({"ezbake.security.cache.type": "REDIS"});
        config.get("ezbake.security.cache.type").should.equal("REDIS");
    });

    it('should set cache type to memory by default', function() {
        var config = new NoZConfig({});
        config.get("ezbake.security.cache.type").should.equal("MEMORY");
    });

    // RWP: invalid values current do not throw exceptions, whereas in the Java implementation they do.
    // If this is wrong, then change the test to reflect this.
    it('should not set the cache type to anything other than Memory or Redis', function() {
        var config = new NoZConfig({"ezbake.security.cache.type": "invalid"});
        config.get("ezbake.security.cache.type").should.equal("MEMORY");
    });


});
