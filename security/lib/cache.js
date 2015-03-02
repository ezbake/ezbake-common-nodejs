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
 *
 * Created by jhastings on 1/15/15.
 */

var _ = require('lodash-node');
var cache_manager = require('cache-manager');

var ezbakeBaseTypes = require('./thrift/ezbakeBaseTypes_types');
var TokenRequest = ezbakeBaseTypes.TokenRequest;
var TokenType = ezbakeBaseTypes.TokenType;
var TokenTypeStrings = Object.keys(TokenType);

function generate_cache_key(token_type, subject, target_app, exclude_auths, request_chain) {
    // Allow TokenRequest object to be passed in as the first argument
    if (_.isObject(token_type) && token_type instanceof TokenRequest) {
        var token_request = token_type;
        token_type = token_request.type;
        if (token_type === TokenType.APP) {
            subject = token_request.securityId;
        } else {
            // Deserialize the proxy principal
            var pp = JSON.parse(token_request.proxyPrincipal.proxyToken);
            if (_.has(pp, 'x509') && _.has(pp.x509, 'subject')) {
                subject = pp.x509.subject;    
            } else {
                throw new Error("Invalid ProxyPrincipal object. No property proxyToken.x509.subject");
            }
        }
        target_app = token_request.targetSecurityId;
        exclude_auths = token_request.excludeAuthorizations;
        if (_.has(token_request, "tokenPrincipal") && token_request.tokenPrincipal) {
            request_chain = token_request.tokenPrincipal.validity.requestChain;
        }
    }

    // Validate arguments
    if ((_.isNumber(token_type) && token_type >= TokenTypeStrings.length || token_type < 0) ||
        (_.isString(token_type) && !_.contains(TokenTypeStrings, token_type))) {
        throw new Error("Invalid token type: "+token_type);
    }
    if (!_.isString(subject) || _.isNull(subject)) {
        throw new Error("Invalid subject: "+subject);
    }
    if (!_.isString(target_app) && !_.isEmpty(target_app)) {
        throw new Error("Invalid target_app: "+target_app);
    }
    if (exclude_auths && !_.isArray(exclude_auths)) {
        throw new Error("Invalid exclude_auths: "+exclude_auths);
    }
    if (request_chain && !_.isArray(request_chain)) {
        throw new Error("Invalid request_chain: "+request_chain);
    }

    var key_token_type = (_.isString(token_type))? token_type : Object.keys(TokenType)[token_type];
    var key_subject = subject;
    var key_target_app = target_app;
    var key_exclude_auths = (exclude_auths)? exclude_auths.join(",") : '';
    var key_request_chain = (request_chain)? request_chain.join(",") : '';

    return [key_token_type, key_subject, key_target_app, key_exclude_auths, key_request_chain].join('');
}

exports.generate_cache_key = generate_cache_key;
