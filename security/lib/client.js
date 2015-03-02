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

/**
 * @author Gary Drocella
 * @date 01/02/14
 * Description: Node JS Client based on the EzbakeSecurityClient.java
 */

var fs = require("fs");
var path = require('path');
var thrift = require("thrift");
var cache_manager = require('cache-manager');

/* Ezbake libs */
var EzConfiguration = require('ezbake-configuration');
var ThriftUtils = require("ezbake-thrift-utils").ThriftUtils;

/* Thrift types */
var ezbakeBaseTypes = require('./thrift/ezbakeBaseTypes_types');
var EzSecurityPrincipal = ezbakeBaseTypes.EzSecurityPrincipal;
var ValidityCaveats = ezbakeBaseTypes.ValidityCaveats;
var TokenRequest = ezbakeBaseTypes.TokenRequest;
var TokenType = ezbakeBaseTypes.TokenType;
var UserInfo = ezbakeBaseTypes.UserInfo;
var EzSecurityToken = ezbakeBaseTypes.EzSecurityToken;
var ProxyUserToken = ezbakeBaseTypes.ProxyUserToken;
var ProxyPrincipal = ezbakeBaseTypes.ProxyPrincipal;
var Authorizations = require('./thrift/ezbakeBaseAuthorizations_types').Authorizations;

/* Thrift services */
var EzSecurity = require("./thrift/EzSecurity.js");
var EZ_SECURITY_SERVICE_NAME = require('./thrift/ezsecurity_types').SERVICE_NAME;
var COMMON_SERVICE_APP_NAME = "common_services";

/* Internal libs */
var cons = require('./constant');
var Crypto = require('./crypto/rsaKeyCrypto');
var tokenUtils = require('./tokenUtils');
var cache = require('./cache');


/* -- Constructors -- */

/**
 * EzbakeSecurityClient Constructor
 *
 * @param ezConfig optionally pass in an EzConfiguration object. If null or undefined, will use the default EzConfiguration
 */
function EzbakeSecurityClient(ezConfig) {

    // Get a new EzConfiguration if one wasn't passed in
    if(typeof ezConfig === "undefined" || !ezConfig) {
        ezConfig = new EzConfiguration.EzConfiguration();
    }
    this.ezConfiguration = ezConfig;
    this.thriftUtils = new ThriftUtils(ezConfig);

    // cache the security ID and ssl dir for this configuration
    this.securityId = this.ezConfiguration.getString(cons.SECURITY_ID_KEY);
    this.sslDir = this.ezConfiguration.getString(cons.SSL_DIR_KEY);

    // Only load these files ahead of time if we're not in mock mode
    if (!this.useMock() && this.thriftUtils.useSsl) {
        this._getCrypto();
    }

    // Cache initialization
    this.tokenCache = cache_manager.caching({store: 'memory', max: 1000});
}


/* -- Lazy Loading... or not -- */

/**
 * Wrapper around the crypto object that lets us do lazy initialization
 */
EzbakeSecurityClient.prototype._getCrypto = function _getCrypto(){
    if (!this.crypto) {
        this.crypto = new Crypto(this.sslDir, cons.PRIVATE_KEY_FILE, cons.EZSECURITY_PUBLIC_KEY);
    }
    return this.crypto;
};

/**
 * Wrapper around loading the application cert to allow for lazy loading
 */
EzbakeSecurityClient.prototype._getAppCert = function _getAppCert() {
    if (!this.appCert) {
        this.appCert = fs.readFileSync(path.join(this.sslDir, cons.CERT_FILE), "utf8");
    }
    return this.appCert;
};

/**
 * Wrapper around loading the ca cert to allow for lazy loading
 */
EzbakeSecurityClient.prototype._getCACert = function _getCACert() {
    if (!this.caCert) {
        this.caCert = fs.readFileSync(path.join(this.sslDir, cons.CA_FILE), "utf8");
    }
    return this.caCert;
};


/* -- Mock Modes -- */

/**
 * Use to determine whether or not to use mock mode
 */
EzbakeSecurityClient.prototype.useMock = function() {
  return this.ezConfiguration.getBoolean(cons.mock.MOCK_PROPERTY, false);
};

/**
 * Generate a mocked out EzSecurity token
 */
function mockToken(securityId, targetSecurityId, principal) {
    var token = new EzSecurityToken();
    token.validity = new ValidityCaveats();
    token.validity.issuer = "EzSecurity";
    token.validity.issuedTo = securityId;
    token.validity.issuedFor = targetSecurityId;
    token.validity.notAfter = Date.now() + 1000;
    token.validity.signature = "";
    token.type = TokenType.USER;
    token.tokenPrincipal = new EzSecurityPrincipal();
    token.tokenPrincipal.principal = principal;
    token.tokenPrincipal.validity = new ValidityCaveats();
    token.tokenPrincipal.validity.issuer = "EzSecurity";
    token.tokenPrincipal.validity.issuedTo = securityId;
    token.tokenPrincipal.validity.issuedFor = targetSecurityId;
    token.tokenPrincipal.validity.notAfter = Date.now()+1000;
    token.tokenPrincipal.validity.signature = "";
    token.authorizations = new Authorizations();

    return token;
}

/**
 * Get a token from the cache or, if not present, from the security service
 *
 * @param tokenRequest token request for EzSecurity
 * @param cb an (err, token) callback
 */
EzbakeSecurityClient.prototype.get_cached_token = function get_cached_token(tokenRequest, cb) {
  var self = this;
  var tokenCache = this.tokenCache;
  var key = cache.generate_cache_key(tokenRequest);

  tokenCache.get(key, function(err, result) {
    if (err) {
      return cb(err);
    }

    // Check token in cache is valid and not expired
    if (result) {
      try {
        if (tokenUtils.validateTokenResponse(self._getCrypto(), result)) {
          return cb(null, result);
        }
        tokenCache.del(key);
      } catch (e) {
        tokenCache.del(key);
      }
    }

    // Fetch token and store in cache
    self.requestToken(tokenRequest, function(err, result) {
      if (err) {
        return cb(err);
      }
      tokenCache.set(key, result);
      cb(null, result);
    });
  });
};

/**
 * Request a token from EzSecurity. This method uses thrift utils to obtain a connection and will
 * verify the token signature of the received token.
 *
 * @param tokenRequest a TokenRequest object. The timestamp will be updated to now, and signature generated
 * @param cbk a callback which takes two parameters, error and token
 */
EzbakeSecurityClient.prototype.requestToken = function requestToken(tokenRequest, cbk) {
    var crypto = this._getCrypto();

    tokenRequest.timestamp = tokenUtils.now();
    var signature = crypto.sign(tokenUtils.serializeTokenRequest(tokenRequest));
    this.thriftUtils.getConnection(COMMON_SERVICE_APP_NAME, EZ_SECURITY_SERVICE_NAME, function(err, connection, close){
        thrift.createClient(EzSecurity, connection).requestToken(tokenRequest, signature, function(err, token) {
            if(close) close();
            if(err) {
                console.log("#requestToken error: " + err);
                cbk(err);
            } else {
              try {
                if (tokenUtils.validateTokenResponse(crypto, token)) {
                  return cbk(null, token);
                }
                cbk("token failed validation");
              } catch (e) {
                cbk(e);
              }
            }
        });
    });
};


/* -- Thrift requests to EzSecurity -- */

/**
 * Ping the EzSecurity service
 *
 * @param cbk callback with (err, result)
 */
EzbakeSecurityClient.prototype.ping = function ping(cbk) {
  // if the client is currently in mock mode, return true
  if (this.useMock()) {
    cbk(null, true);
    return;
  }
  getClient(this, function(err, connection, close) {
    if (err) {
      cbk(err);
    } else {
      thrift.createClient(EzSecurity, connection).ping(function (err, resp) {
        if (close) close();
        if (cbk) cbk(err, resp);
      });
    }
  });
};

/**
 * Request application information from the ezbake security service
 *
 * @param targetApp application the app token will be issuedFor
 * @param cbk callback with (err, token)
 * @throws AppNotRegisteredException if request application ID does not exists in EzSecurityClient
 */
EzbakeSecurityClient.prototype.fetchAppToken = function fetchAppToken(targetApp, cbk) {
    var self = this;

    // if not targetApp ID passed, shuffle the variables
    if (typeof(targetApp) === 'function') {
        cbk = targetApp;
        targetApp = this.securityId;
    }

    // if the client is currently in mock mode, return a generic token
    if (this.useMock()) {
        cbk(null, mockToken(this.securityId, targetApp, this.securityId));
        return;
    }

    // Build the request
    var request = new TokenRequest({
        securityId: self.securityId,
        type: TokenType.APP,
        timestamp: Date.now(),
        targetSecurityId: targetApp
    });

    self.get_cached_token(request, cbk);
};

/**
 * Request a User EzSecurityToken from the security service
 *
 * @param httpRequest an http request. expects http request headers to be available in a map at httpRequest.headers
 * @param targetSecurityId optionaly request a token that can be forwarded to a target application
 * @param cbk a callback function, conforms to the (err, response) form where response is an EzSecurityToken
 */
EzbakeSecurityClient.prototype.fetchTokenForProxiedUser = function fetchTokenForProxiedUser(httpRequest, targetSecurityId, cbk) {
    // if targetSecurityId is a function, assume it's the callback
    if (typeof(targetSecurityId) === 'function') {
        cbk = targetSecurityId;
        targetSecurityId = this.securityId;
    }

    var self = this;
    var principal = this.requestPrincipalFromRequest(httpRequest);

    // if the client is currently in mock mode, return a generic token
    if (this.useMock()) {
        cbk(null, mockToken(this.securityId, targetSecurityId, JSON.parse(principal.proxyToken).x509.subject));
        return;
    }

    var tokenRequest = new TokenRequest({
        "securityId": this.securityId,
        "targetSecurityId": targetSecurityId,
        "timestamp": Date.now(),
        "proxyPrincipal": principal,
        "type": TokenType.USER
    });
    self.get_cached_token(tokenRequest, cbk);
};


/* -- Token Validation -- */

EzbakeSecurityClient.prototype.validateReceivedToken = function validateReceivedToken(token, cbk) {
    if(this.useMock()) {
        return true;
    }

  return tokenUtils.verifyReceivedToken(
      this._getCrypto().getPublicPEM(),
      token,
      this.securityId,
      function (err, valid) {
        if (err) {
          cbk(err, valid);
        } else {
          cbk(null, valid);
        }
      });
};

/**
 * Check the request headers inserted by EFE and validate the signatures
 */
EzbakeSecurityClient.prototype.validateCurrentRequest = function validateCurrentRequest(req) {
    if (this.useMock()) {
        return true;
    }
    return this.validateProxyPrincipal(this.requestPrincipalFromRequest(req));
};

/**
 * Validate a proxy principal object
 * 
 * @param proxyPrincipal A proxy principal object (proxyToken:string, signature:string)
 */
EzbakeSecurityClient.prototype.validateProxyPrincipal = function validateProxyPrincipal(proxyPrincipal) {
    if (proxyPrincipal == null || !proxyPrincipal instanceof ProxyPrincipal) {
        throw new Error("Invalid object passed to validate");
    }

    var json = proxyPrincipal.proxyToken;
    var signature = proxyPrincipal.signature;
    if (!json || !signature) {
        throw new Error("Invalid object passed to validate. "+((!json)?"proxyToken":"proxyToken signature")+ " is missing");
    }

    if (this._getCrypto().verify(json, signature)) {
        var parsed = new ProxyUserToken(JSON.parse(json));
        if (parsed.notAfter < Date.now()) {
            throw new Error("Proxy principal token was expired");
        }
    }
    return true;
};

/**
 * Read the user dn and signature out of the request headers
 */
EzbakeSecurityClient.prototype.requestPrincipalFromRequest = function requestPrincipalFromRequest(request) {
    if(this.useMock()) {
        var user = this.ezConfiguration.getString(cons.mock.MOCKUSER_PROPERTY);
        return new ProxyPrincipal({
            proxyToken: JSON.stringify({
                x509: { subject: user },
                issuedBy: "EzSecurity",
                issuedTo: "EFE",
                notAfter: (Date.now()+1000).toString() }),
            signature: ""
        });
    }
    var dn = getHeaderValue(request, cons.headers.USER_DN);
    var signature = getHeaderValue(request, cons.headers.DN_SIGNATURE);

    return new ProxyPrincipal({proxyToken: dn, signature: signature});
};

function getHeaderValue(request, header) {
    var value = request.headers[header];
    if (value == null) {
        // try to get the header the rails way
        value = request.headers[("http_"+header).toUpperCase()];
    }
    return value;
}


/* -- Thrift Helpers -- */

/**
 * Get an EzSecurity.Client calls callback with connection and close function
 *
 * @param inst an EzbakeSecurityClient instance
 * @param cb the callback to be called with the client
 */
function getClient(inst, cb) {
  var options = {};
  inst.thriftUtils.getConnection(COMMON_SERVICE_APP_NAME, EZ_SECURITY_SERVICE_NAME, options, function(err, client, close){
    if(err){
      if(close !== undefined)
        close();
    }
    cb(err, client, close)
  });
}

/* -- Exports --*/
module.exports = EzbakeSecurityClient;
