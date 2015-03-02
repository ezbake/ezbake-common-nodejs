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
 * @date 01/15/14
 * Description: Test
 */
var assert = require("assert");
var fs = require("fs");
var crypto = require("crypto");

var RSAKeyCrypto = require("../../lib/crypto/rsaKeyCrypto");


var sslDir = "test/conf/server";
var privateKeyFile = "application.priv";
var publicKeyFile = "application.pub";
var privateKeyPath = sslDir + "/" + privateKeyFile;
var publicKeyPath = sslDir + "/" + publicKeyFile;

describe("RSA Sign/Verify Sanity Test", function() {
    it("Should sign and verify...", function() {
        var privateKey = fs.readFileSync(privateKeyPath, "utf8");
        var publicKey = fs.readFileSync(publicKeyPath, "utf8");

        var signer = crypto.createSign("RSA-SHA256");
        signer.update("SignMe");
        var sign = signer.sign(privateKey, "hex");
        var verifier = crypto.createVerify("RSA-SHA256");
        verifier.update("SignMe");
        var result = verifier.verify(publicKey, sign, "hex");

        assert(result === true);
    })
});

describe("RSAKeyCrypto", function() {
    var privateKey;
    var publicKey;

    before(function() {
        privateKey = fs.readFileSync(privateKeyPath, "utf8");
        publicKey = fs.readFileSync(publicKeyPath, "utf8");
    });

    describe("#RSAKeyCrypto", function() {
        it("should take 2 arguments to mean private/public have already been loaded", function() {
            var crypto = new RSAKeyCrypto(privateKey, publicKey);
            assert(crypto.hasPrivate() === true);
            assert(crypto.hasPublic() === true);
            assert(crypto.getPrivatePEM() === privateKey);
            assert(crypto.getPublicPEM() === publicKey);
        });
        it("should take 3 arguments to mean private/public need to be loaded from a directory", function() {
            var crypto = new RSAKeyCrypto(sslDir, privateKeyFile, publicKeyFile);
            assert(crypto.hasPrivate() === true);
            assert(crypto.hasPublic() === true);
            assert(crypto.getPrivatePEM() === privateKey);
            assert(crypto.getPublicPEM() === publicKey);
        });
    });

    describe("#sign", function() {
        var crypto;
        before(function() {
            crypto = new RSAKeyCrypto(privateKey, publicKey);
        });

        it("should sign strings", function() {
            var signature = crypto.sign("SignMe");
            assert(signature);
        });

        it("should produce base64 encoded strings", function() {
            var signature = crypto.sign("SignMe");

            // Not sure if this is really a valid assertion - it passes though
            var decoded = new Buffer(signature, 'base64');
            assert(signature === new Buffer(decoded).toString('base64'));
        });

    });

    describe("#verify", function() {
        var data = "some data";
        var signature;
        var crypto;
        before(function() {
            crypto = new RSAKeyCrypto(privateKey, publicKey);
            signature = crypto.sign(data);
        });
        it("Should verify signature", function() {
            assert(crypto.verify(data, signature));
        })
    })
});

