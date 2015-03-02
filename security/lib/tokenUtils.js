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

var util = require('util');
var stream = require('stream');
var ezbakeBaseTypes = require('./thrift/ezbakeBaseTypes_types');

var EzSecurityToken = ezbakeBaseTypes.EzSecurityToken;
var TokenType = ezbakeBaseTypes.TokenType;
var UserInfo = ezbakeBaseTypes.UserInfo;
var AppInfo = ezbakeBaseTypes.AppInfo;
var CommunityMembership = ezbakeBaseTypes.CommunityMembership;


/**
 * Get the current time in milliseconds
 * @returns {number}
 */
function now() {
  return new Date().getTime();
}

/**
 * Serialize an EzSecurityPrincipal
 */
function serializePrincipal(principal) {
  var buffer = new BufferStream();
  buffer.write(principal.principal);
  buffer.write(principal.validity.notAfter.toString());
  if (principal.requestChain) {
    for (var app in principal.requestChain) {

    }
  }
  buffer.end();
  return buffer.store;
}

function signPrincipal(crypto, principal) {
  return crypto.sign(principal);

}

function serializeTokenRequest(request) {
  var buffer = new BufferStream();

  if (request.proxyPrincipal != null) {
    buffer.write(request.proxyPrincipal.proxyToken);
    buffer.write(request.proxyPrincipal.signature);
  } else if (request.tokenPrincipal != null) {
    throw new Error("Not implemented. Cannot fetch derived token");
  }

  buffer.write(getTokenTypeString(request.type))
  buffer.write(request.securityId);
  buffer.write(request.targetSecurityId);
  buffer.write(request.timestamp.toString());

  buffer.end();
  return buffer.store;
}


/**
 * Serialize an EzSecurityToken
 */
function serializeToken(token) {
  var buffer = new BufferStream();

  // Validity info - who, what when
  buffer.write(token.validity.issuedTo);
  if (token.validity.issuedFor && token.validity.issuedFor.length > 0) {
    buffer.write(token.validity.issuedFor);
  }
  if (token.validity.notAfter != null) {
    buffer.write(token.validity.notAfter.toString());
  } else {
    buffer.write("0");
  }
  if (token.validity.notBefore != null) {
    buffer.write(token.validity.notBefore.toString());
  } else {
    buffer.write("0");
  }
  if (token.validity.issuedTime != null) {
    buffer.write(token.validity.issuedTime.toString());
  } else {
    buffer.write("0");
  }

  // Token type
  buffer.write(getTokenTypeString(token.type));

  // Token principal
  buffer.write(token.tokenPrincipal.principal);
  if (token.tokenPrincipal.issuer) {
    buffer.write(token.tokenPrincipal.issuer);
  }
  if (token.tokenPrincipal.requestChain) {
    for (var i in token.tokenPrincipal.requestChain) {
      buffer.write(token.tokenPrincipal.requestChain[i]);
    }
  }

  // Authorizations
  if (token.authorizationLevel && token.authorizationLevel.length > 0) {
    buffer.write(token.authorizationLevel);
  }
  if (token.authorizations) {
    if (token.authorizations.formalAuthorizations) {
      var auths = token.authorizations.formalAuthorizations.sort();
      for (var auth in auths) {
        buffer.write(auths[auth]);
      }
    }
    if (token.authorizations.externalCommunityAuthorizations) {
      var auths = token.authorizations.externalCommunityAuthorizations.sort();
      for (var auth in auths) {
        buffer.write(auths[auth]);
      }
    }
    if (token.authorizations.platformObjectAuthorizations) {
      var auths = token.authorizations.platformObjectAuthorizations.sort(function(a, b) {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      });
      for (var auth in auths) {
        buffer.write(auths[auth].toString());
      }
    }
  }

  // External groups
  if (token.externalProjectGroups) {
    var projects = token.externalProjectGroups;
    var pKeys = Object.keys(projects).sort();

    for(key in pKeys) {
      buffer.write(pKeys[key]);
      pValue = projects[pKeys[key]].sort();
      for(val in pValue) {
        buffer.write(pValue[val]);
      }
    }
  }

  if (token.externalCommunities) {
    var communities = token.externalCommunities;
    var cKeys = Object.keys(communities).sort();

    for (comm in communities) {
      var community = communities[comm];
      buffer.write(community.name);
      buffer.write(community.type);
      buffer.write(community.organization);

      community.groups.sort();
      for (grp in community.groups) {
        buffer.write(community.groups[grp]);
      }
      community.topics.sort();
      for (topic in community.topics) {
        buffer.write(community.topics[topic]);
      }
      community.regions.sort();
      for (reg in community.regions) {
        buffer.write(community.regions[reg]);
      }
      if (community.flags != null) {
        var keys = Object.keys(community.flags).sort();
        for (key in keys) {
          buffer.write(keys[key]);
          var val = community.flags[keys[key]];
          if (typeof val !== "undefined" && val != null) {
            buffer.write(val.toString());
          }
        }
      }
    }
  }

  if (token.validForExternalRequest) {
    buffer.write(token.validForExternalRequest.toString());
  } else {
    buffer.write("false");
  }
  if (token.citizenship) {
    buffer.write(token.citizenship);
  }
  if (token.organization) {
    buffer.write(token.organization);
  }

  buffer.end();
  return buffer.store;
}

function verify(crypto, data, signature) {
  return crypto.verify(data, signature);
}

function verifyTokenSignature(crypto, token) {
  var sData = serializeToken(token);
  return verify(crypto, sData, token.validity.signature);
}

/**
 * Check the token signature and not after time
 *
 * @param crypto object configured with the security service public key
 * @param token token object to be verified
 * @returns {boolean} true if valid
 * @throws {Error} error if the token is not valid
 */
function validateTokenResponse(crypto, token) {
  if (verify(crypto, serializeToken(token), token.validity.signature)) {
    // Check timestamp
    var currentTime = now();
    if (token.validity.notAfter < currentTime) {
      throw new Error("Token not after time has passed: " + token.validity.notAfter + " < " + currentTime);
    }
  } else {
    throw new Error("Token Signature failed to verify");
  }
  return true;
}

function getTokenTypeString(tokenType) {
  return Object.keys(TokenType)[tokenType];
}

/**
 * BufferStream
 *
 * A stream backed by a buffer. Access bstream.store after closing the stream to get the buffer
 */
function BufferStream(options) {
  stream.Writable.call(this, options);
  this.store = new Buffer('');
}
util.inherits(BufferStream, stream.Writable);
BufferStream.prototype._write = function(chunk, enc, cb) {
  var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
  this.store = Buffer.concat([this.store, buffer]);
  cb();
};


exports.now = now;
exports.serializePrincipal = serializePrincipal;
exports.serializeToken = serializeToken;
exports.serializeTokenRequest = serializeTokenRequest;
exports.verifyTokenSignature = verifyTokenSignature;
exports.validateTokenResponse = validateTokenResponse;
