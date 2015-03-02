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

var assert = require("assert");
var fs = require('fs');

var EzConfiguration = require('ezbake-configuration');

var EzbakeSecurityClient = require('../..').Client;
var constants = require('../../lib/constant');
var RSAKeyCrypto = require("../../lib/crypto/rsaKeyCrypto");

var serverPrivate = fs.readFileSync("test/conf/server/application.priv", "utf8");

describe("EzbakeSecurityClient", function() {
    var ezConfig;
    before(function() {
        process.env['EZCONFIGURATION_DIR'] = "test/conf";
        var directoryLoader = new EzConfiguration.loaders.DirectoryConfigurationLoader();
        ezConfig = new EzConfiguration.EzConfiguration(directoryLoader);
        ezConfig.getProperties()[constants.mock.MOCK_PROPERTY] = 'true';
        ezConfig.getProperties()[constants.mock.MOCKUSER_PROPERTY] = "CN=test";
    });

    it("should be able to get dn from request", function() {
        var client = new EzbakeSecurityClient(ezConfig);
        var dn = client.requestPrincipalFromRequest();
        assert(dn);
        assert(dn.proxyToken);
        assert(dn.signature != null);
    });

    it("should verify EFE verified dn", function() {
        var client = new EzbakeSecurityClient(ezConfig);
        var req = { headers: {}};
        req.headers[constants.headers.USER_DN] = "test";
        req.headers[constants.headers.DN_EXPIRES] = Date.now();
        req.headers[constants.headers.DN_SIGNATURE] = "signature"

        assert(client.validateCurrentRequest(req));
    });

    it("should verify current request", function() {
        var client = new EzbakeSecurityClient(ezConfig);
        assert(client.validateCurrentRequest());
    });

    describe("#ping", function() {
        it("should return false in mock mode", function(done) {
            var client = new EzbakeSecurityClient(ezConfig);
            client.ping(function(err, pong) {
                assert(!err);
                assert(pong === true);
                done();
            });

        });
    });

    describe("#fetchTokenForProxiedUser", function() {
        it("should get a mock user EzSecurityToken", function(done) {
            var client = new EzbakeSecurityClient(ezConfig);

            client.fetchTokenForProxiedUser(null, function(err, token) {
                assert(!err);
                assert(token);
                assert(token.tokenPrincipal.principal === "CN=test");
                assert(token.validity.issuer);
                assert(token.tokenPrincipal.validity);
                done();
            });
        });
    });

    describe("#fetchAppToken", function() {
        it("should return a mock EzSecurityToken when in mock", function(done) {
            var client = new EzbakeSecurityClient(ezConfig);
            client.fetchAppToken("target", function(err, token) {
                assert(!err);
                assert(token);
                assert(token.validity.issuer);
                assert(token.tokenPrincipal.validity);
                done();
            });
        });
    });
});

