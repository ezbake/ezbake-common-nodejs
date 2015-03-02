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
var path = require('path');

var EzConfiguration = require('ezbake-configuration');
var EzbakeSecurityClient = require('../..').Client;
var RSAKeyCrypto = require("../../lib/crypto/rsaKeyCrypto");

var ProxyPrincipal = require('../../lib/thrift/ezbakeBaseTypes_types').ProxyPrincipal;

var serverPrivate = fs.readFileSync("test/conf/server/application.priv", "utf8");
var proxyTokenJSON = {
    "x509":{"subject":"Hodor"},"issuedBy":"EzSecurity","issuedTo":"EFE","notAfter":(Date.now()+1000).toString()};

describe("EzSecurity.Client", function() {
  var ezConfig;
  before(function() {
    ezConfig = new EzConfiguration.EzConfiguration();
    ezConfig.getProperties()['ezbake.security.ssl.dir'] = path.join(__dirname, '../conf/client');
  });

  describe("#verifyProxyPrincipal", function() {
    it("should parse the correctly formatted JSON string", function() {
      var client = new EzbakeSecurityClient(ezConfig);
      var crypto = new RSAKeyCrypto(serverPrivate, true);

      var json = JSON.stringify(proxyTokenJSON);

      var pp = new ProxyPrincipal({proxyToken: json, signature: crypto.sign(json)});
      console.log(pp);
      client.validateProxyPrincipal(pp);
    });
  });
});
