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

describe('NoZConfig', function() {
    it('should have properties loaded from config directory', function() {
        var config = new NoZConfig('config');
        config.selectedPropertyNames().should.not.be.empty;
    });

    it("should recognize property names from config file", function() {
        var config = new NoZConfig('config');
        config.get("zookeeper.connection.string").should.not.be.empty;
    });

    it('should load with no properties when no parameters are passed in', function() {
        var config = new NoZConfig(false);
        config.selectedPropertyNames().should.be.empty;
    });

    it("should load properties that a directory", function() {
        var config = new NoZConfig('test/testData');
        config.get("property1").should.equal("one");
        config.get("property2").should.equal("two");
        config.get("dotted.property3").should.equal("three");
    });

    it('should not load from directories that do not exist', function() {
        var openConfigFunction = function() { var config = new NoZConfig('nonExistantConfig'); };
        assert.throws(openConfigFunction, Error, "ENOENT");
    });

    it('should fail when attempting to load from a file that does not exist', function() {
        var emptyConfigFileFunction = function() { 
            var config = new NoZConfig();
            config.loadPropertiesFromFile('config/', 'thisfiledoenotexist.properties'); 
        };
        assert.throws(emptyConfigFileFunction, Error, "ENOENT");
    });

    it('should not set properties that already exist', function() {
        var config = new NoZConfig('config');
        var resetParameterFunction = function() { config.set("accumulo.instance.name", "anotherInstance"); };
        assert.throws(resetParameterFunction, Error, "Configuration variables cannot be reassigned once set");
    });

    // RWP: added test for standard database connection strings that contain equal signs
    it("should correctly load property values with equal signs", function() {
        var config = new NoZConfig('test/testData');
        config.get("dummyDb.connectionString").should.equal("Server=dummy/db1;Database=testDb;UserId=admin;Password=thisisahorriblepassword;");
    });


});
