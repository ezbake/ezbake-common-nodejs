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


describe('Application Configuration', function() {

    describe('when not setting Openshift repo directory', function() {

        it('should get certificate directory from properties', function() {
            var config = new NoZConfig('test/testData');
            var propertyValue = config.get("ezbake.security.ssl.dir");
            propertyValue.should.equal('certs/ssl');
        });

    });

    describe('when setting Openshift repo directory', function() {

        beforeEach(function() {
            // setting environment variable overrides manually through nconf.
            nconf.defaults({"OPENSHIFT_REPO_DIR": "/tmp/openshift"});
        });

        afterEach(function() {
            nconf.remove("OPENSHIFT_REPO_DIR");
        });

        it("should load from a directory", function() {
            var config = new NoZConfig('test/testData');
            var propertyValue = config.get("ezbake.security.ssl.dir");
            propertyValue.should.equal('/tmp/openshift/certs/ssl');
        });

    });

});
