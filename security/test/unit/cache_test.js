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
 * Created by jhastings on 1/15/15.
 */

var cache = require('../../lib/cache');

var ezbakeBaseTypes = require('../../lib/thrift/ezbakeBaseTypes_types');
var TokenRequest = ezbakeBaseTypes.TokenRequest;
var TokenType = ezbakeBaseTypes.TokenType;
var TokenTypeStrings = Object.keys(TokenType);

describe('cache', function() {
    describe('#generate_cache_key()', function() {
        it('should accept integer token type', function() {
            cache.generate_cache_key(0, '').should.equal(TokenTypeStrings[0]);
            cache.generate_cache_key(1, '').should.equal(TokenTypeStrings[1]);
            (function() {
                cache.generate_cache_key(-1, '');
            }).should.throwError('Invalid token type: -1');
            (function() {
                cache.generate_cache_key(2, '');
            }).should.throw('Invalid token type: 2');
        });
        it('should accept string token type', function() {
            cache.generate_cache_key(TokenTypeStrings[0], '').should.equal(TokenTypeStrings[0]);
            cache.generate_cache_key(TokenTypeStrings[1], '').should.equal(TokenTypeStrings[1]);
            (function() {
                cache.generate_cache_key('type', '');
            }).should.throw('Invalid token type: type');
        });
        it('should only accept strings for the subject', function() {
            cache.generate_cache_key(0, 'jon').should.equal(TokenTypeStrings[0]+"jon");
            (function() {
                cache.generate_cache_key(0);
            }).should.throw('Invalid subject: undefined');
            (function() {
                cache.generate_cache_key(0, null);
            }).should.throw('Invalid subject: null');
            (function() {
                cache.generate_cache_key(0, 0);
            }).should.throw('Invalid subject: 0');
        });
        it('should only accept strings for the target_app', function() {
            cache.generate_cache_key(0, 'jon', 'target').should.equal(TokenTypeStrings[0]+"jontarget");
            (function() {
                cache.generate_cache_key(0);
            }).should.throw('Invalid subject: undefined');
            (function() {
                cache.generate_cache_key(0, null);
            }).should.throw('Invalid subject: null');
            (function() {
                cache.generate_cache_key(0, 0);
            }).should.throw('Invalid subject: 0');
        });
        it('should accept array of strings for exclude auths', function() {
            cache.generate_cache_key(0, 'jon', 'target', ['a', 'b']).should.equal(TokenTypeStrings[0]+"jontargeta,b");
            (function() {
                cache.generate_cache_key(0, '', '', 'invalid auths');
            }).should.throw('Invalid exclude_auths: invalid auths');
        });
        it('should accept array of strings for request chain', function() {
            cache.generate_cache_key(0, 'jon', 'target', [], ['app1', 'app2']).should.equal(TokenTypeStrings[0]+"jontargetapp1,app2");
            (function() {
                cache.generate_cache_key(0, '', '', [], 'invalid chain');
            }).should.throw('Invalid request_chain: invalid chain');
        });
        it('should accept a TokenRequest object as the first argument', function() {
            var securityId = "abcde";
            var app_token_request = new TokenRequest({
                type: TokenType.APP,
                securityId: securityId
            });
            var user_token_request = new TokenRequest({
                type: TokenType.USER,
                targetSecurityId: securityId,
                proxyPrincipal: {
                    proxyToken: '{"x509":{"subject":"jon"}}'
                }
            });
            cache.generate_cache_key(app_token_request).should.equal(TokenTypeStrings[TokenType.APP]+securityId);
            cache.generate_cache_key(user_token_request).should.equal(TokenTypeStrings[TokenType.USER]+'jon'+securityId);
        });
    });
});

