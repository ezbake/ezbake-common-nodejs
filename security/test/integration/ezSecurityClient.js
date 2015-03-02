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

var should = require('should');
var assert = require("assert");
var fs = require('fs');
var path = require('path');

/* EzBake Libraries */
var EzConfiguration = require('ezbake-configuration');

var constants = require('../../lib/constant');
var EzSecurity = require("../..");

var ezbakeBaseTypes = require("../../lib/thrift/ezbakeBaseTypes_types");
var TokenType = ezbakeBaseTypes.TokenType;
var ProxyPrincipal = ezbakeBaseTypes.ProxyPrincipal;

var serverPrivate = fs.readFileSync("test/conf/server/application.priv", "utf8");


// Set up the zookeeper. default to EzCentos private IP, allow override on the cli
var zookeeper = "192.168.50.105:2181";
for (var index in process.argv) {
  var str = process.argv[index];
  if(str.indexOf("--zookeeper") === 0) {
    var vals = str.split("=");
    if (vals.length > 0) {
      zookeeper = vals[1];
      console.log("Test using zookeeper: %s", zookeeper);
    }
  }
}

describe("EzSecurity.Client", function() {
  var ezConfig;
  var client;
  before(function() {
    ezConfig = new EzConfiguration.EzConfiguration();
    ezConfig.getProperties()[constants.mock.MOCK_PROPERTY] = 'false';
    ezConfig.getProperties()[constants.mock.MOCKUSER_PROPERTY] = "CN=EzbakeClient, OU=42six, O=CSC, C=US";
    ezConfig.getProperties()[constants.zookeeper.connection_string] = zookeeper;
    ezConfig.getProperties()['ezbake.security.app.id'] = 'client';
    ezConfig.getProperties()['ezbake.security.ssl.dir'] = path.join(__dirname, '../conf/client');
    ezConfig.getProperties()['thrift.use.ssl'] = 'false';

    client = new EzSecurity.Client(ezConfig);
  });

  describe("#ping", function() {
    it("should be able to ping security service", function(done) {
      client.ping(function(err, ret) {
        assert(ret);
        done();
      });
    });
  });

  describe("#fetchTokenForProxiedUser", function() {
    var principal = "CN=EzbakeClient, OU=42six, O=CSC, C=US";
    var req = { headers: {}};
    var json = JSON.stringify({
      x509: { subject: "CN=EzbakeClient, OU=42six, O=CSC, C=US"},
      issuer: "EzSecurity",
      issuedTo: "EFE",
      notAfter: (Date.now()+1000).toString()
    });
    req.headers[constants.headers.USER_DN] = json;
    req.headers[constants.headers.DN_SIGNATURE] = "";

    it("should return a token for the given user in the callback", function(done) {
      client.fetchTokenForProxiedUser(req, function(err, token) {
        if (err) console.log(err);
        assert(!err);
        assert(token);
        assert(token.validity.issuedTo === "client");
        assert(token.validity.issuedFor === "client");
        assert(token.tokenPrincipal.principal == principal);
        done();
      });
    });
    it("should take a target security id to request a forwardable token", function(done) {
      client.fetchTokenForProxiedUser(req, "sample-id", function(err, token) {
        if (err) console.log(err);
        assert(!err);
        assert(token);
        assert(token.tokenPrincipal.principal == principal);
        assert(token.validity.issuedTo === "client");
        assert(token.validity.issuedFor === "sample-id");
        done();
      });
    });
    it("should return cached token", function(done) {
      client.fetchTokenForProxiedUser(req, function(err, token) {
        var token_1 = token;
        if (err) console.log(err);
        assert(!err);
        assert(token);
        assert(token.validity.issuedTo === "client");
        assert(token.validity.issuedFor === "client");
        assert(token.tokenPrincipal.principal == principal);
        client.fetchTokenForProxiedUser(req, function(err, token) {
          var token_2 = token;
          if (err) console.log(err);
          assert(!err);
          assert(token);
          assert(token.validity.issuedTo === "client");
          assert(token.validity.issuedFor === "client");
          assert(token.tokenPrincipal.principal == principal);
          assert(token_1 === token_2);
          done();
        });
      });
    });
  });

  describe("#fetchAppToken", function() {
    function verifyAppToken(token, securityId, targetSecurityId) {
      token.should.instanceof(ezbakeBaseTypes.EzSecurityToken);
      token.type.should.eql(TokenType.APP);
      token.validity.issuedTo.should.eql(securityId);
      token.validity.issuedFor.should.eql(targetSecurityId);
      token.tokenPrincipal.principal.should.eql(securityId);
    }
    it("should return the app info token as the second parameter in the callback", function(done) {
      client.fetchAppToken(function(err, token) {
        if (err) console.log(err);
        assert(!err);
        verifyAppToken(token, client.securityId, client.securityId);
        done();
      });
    });
    it("should take targetApp as first parameter, and request token for that target app", function(done) {
      var target = "client";
      client.fetchAppToken(target, function(err, token) {
        if (err) console.log(err);
        assert(!err);
        verifyAppToken(token, client.securityId, target);
        done();
      });
    });
    it("should return cached token", function(done) {
      client.fetchAppToken(function(err, token) {
        var token_1 = token;
        if (err) console.log(err);
        assert(!err);
        verifyAppToken(token, client.securityId, client.securityId);
        client.fetchAppToken(function(err, token) {
          var token_2 = token;
          if (err) console.log(err);
          assert(!err);
          verifyAppToken(token, client.securityId, client.securityId);
          assert(token_1 === token_2);
          done();
        });
      });
    });
  });

  describe("#validateCurrentRequest", function (){
    it("should verify DN signatures", function() {
      // Sign the DN

      var req = { headers: {}};
      req.headers[constants.headers.USER_DN] = "test";
      req.headers[constants.headers.DN_EXPIRES] = Date.now().toString();

      var signature = new EzSecurity.RSAKeyCrypto(serverPrivate, true)
          .sign(req.headers[constants.headers.USER_DN]+req.headers[constants.headers.DN_EXPIRES]);
      req.headers[constants.headers.DN_SIGNATURE] = signature;

      assert(client.validateCurrentRequest(req));
    });
  });

  describe("#verifyEzSecurityDn", function() {
    it("Should verify a security dn token", function() {
      var json = JSON.stringify({
        x509: { subject: "CN=Test User"},
        issuer: "EzSecurity",
        issuedTo: "EFE",
        notAfter: (Date.now()+1000).toString()
      });
      var crypto = new EzSecurity.RSAKeyCrypto(serverPrivate, true);
      var dnToken = new ProxyPrincipal({ proxyToken: json, signature: crypto.sign(json) });
      assert(client.validateProxyPrincipal(dnToken));
    })
  });
});

