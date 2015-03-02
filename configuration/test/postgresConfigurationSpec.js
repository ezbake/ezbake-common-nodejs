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
var nconf = require('nconf');

describe('Postgres Configuration', function() {

    describe('when not setting Postgres environment variables', function() {

        it('should load properties from data file', function() {
            var config = new NoZConfig('test/testData');
            config.get("postgres.host").should.equal("host1");
            config.get("postgres.port").should.equal(1234);
            config.get("postgres.username").should.equal("username1");
            config.get("postgres.password").should.equal("password1");
            config.get("postgres.db").should.equal("db1");
        });

        it('should get connection URL from host and port', function() {
            var config = new NoZConfig('test/testData');
            config.get("postgres.connectionUrl").should.equal("postgresql://host1:1234");
        });

    });

    describe('when setting Postgres environment variables', function() {

        beforeEach(function() {
            // setting environment variable overrides manually through nconf.
            nconf.defaults({
                "OPENSHIFT_POSTGRESQL_DB_HOST": "host2",
                "OPENSHIFT_POSTGRESQL_DB_PORT": 5678,
                "OPENSHIFT_POSTGRESQL_DB_USERNAME": "username2",
                "OPENSHIFT_POSTGRESQL_DB_PASSWORD": "password2",
                "PGDATABASE": "db2"
            });
        });

        afterEach(function() {
            nconf.remove("OPENSHIFT_POSTGRESQL_DB_HOST");
            nconf.remove("OPENSHIFT_POSTGRESQL_DB_PORT");
            nconf.remove("OPENSHIFT_POSTGRESQL_DB_USERNAME");
            nconf.remove("OPENSHIFT_POSTGRESQL_DB_PASSWORD");
            nconf.remove("PGDATABASE");
        });

        // RWP 5/23/14: THIS SHOULD FAIL - FUNCTIONALITY NOT YET IMPLEMENTED
        it('should load properties from environment variables', function() {
            var config = new NoZConfig(false);
            config.get("postgres.host").should.equal("host2");
            config.get("postgres.port").should.equal(5678);
            config.get("postgres.username").should.equal("username2");
            config.get("postgres.password").should.equal("password2");
            config.get("postgres.db").should.equal("db2");
        });

        it('should get connection URL from host and port', function() {
            var config = new NoZConfig(false);
            config.get("postgres.connectionUrl").should.equal("postgresql://host2:5678");
        });

    });


});
