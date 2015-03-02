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
 * @date 01/03/14
 */
 
var assert = require("assert");
var fs = require("fs");

var CryptoUtil = require("../../lib/crypto/CryptoUtil.js");
 
describe("CryptoUtil", function() {
	describe("#stripPEMString", function() {
		it("Should strip a PEM String..", function() {
                    var clean ="MIIEowIBAAKCAQEAvHA68I8yAOXbhcuBksXTRBh/KdfaFcuhEX97/eYwozXqA2cS" +
                                "bA04uWWuTUagbqyJYN972DVnN5lb4jtadbj2mba/ic+4A/Pu+mjVh4Z6iC+y5brx" +
                                "LN5XwHGbRbhX2s5jhIwGd7y+BuIh+czXpaF9aBTcIbtc31HYdSqqMzlGEYWLl6+1" +
                                "VtJ61AGlHFsIyXVUSH3qAfUvnt/OhfHzMG0vzoeTX2rVQ8/enUwYCP1BnoWw7Uco" +
                                "qwsvYRTo07unPrzKlTKCjyGlRtZ9RlhamqfSTAwY4ika80jmb28bZCQ8TOHZG//w" +
                                "E5KenFeIO1S6PXOg6Ti4/AMysS/AGzrU6HSJWQIDAQABAoIBAEz96gcJ6ttVDzl+" +
                                "acWnUGedPq/BAtku5vN4TBf0KmE1ERUs0ukVCd0uP2ZRehFeK49KIJa5Ux/zaAhq" +
                                "Sc6ZsSAi++V52my7CSSFGuGRv5TPMGAO3qV/fwkhIdj9td+vvheVArt/gYDcehdP" +
                                "a7i/37Zb94lMvWh9T1yn/vyI5SkY3K99+L3M1y6DdpXmQbKXE8GfLRwPwPbfDyk7" +
                                "V2YGzcvFeCxvwjM/YQqJbQLwKed8kXSBr9+UPPw8pk40hzhfxYdemv6a62UQHepE" +
                                "LOL1j6jFL4d9j2HeMd1eOPD2QCSDp7hK3HNllsxchzQ+8IdcxiVCPm348oN+un1L" +
                                "C7sxREUCgYEA0ByzXIWyNcTRc7ZgX2i9GbRpDmk6N5xA40k2kxrphasJ/D1wSVO3" +
                                "INKKuGp1HfESEJVTrc8uZOg6cBRiFsCDt0ywbq5ZNsHHLwyUloTjy1V5UnAhRyuv" +
                                "016NDZbf8EIULzEO6rGf0wDHw3ye0ghpmoR4cE2QHjd1GcnJlSCmlsMCgYEA58yb" +
                                "RJlHJvqR3IvDdqbMwudYEf5F64cjSuCLmvaafLE9oatTHjjf8KUSvLmWD5W31zXR" +
                                "psR1Gj1o+XYKvnrPWOkc25WLBmWq/2L1tVAW97rv0IZ13BCCiwZnaNqN0Nuuj7aL" +
                                "cZq3y8VKMRh7VRaTohXHMve1JcaS2YYO1W2GdbMCgYEAuNx1ur8MEVUWlMmxC683" +
                                "IqkuFN4GF7XVsc+sCboDK3hGM2jD4G7boe1DyhLOm90zJcXvgdoipQHgPwTsKLez" +
                                "iNQ3eOmoV8qDy1hKePXsfwca8M6n0NeOpJw9gY++tmWMFmtmi7ViegUcbZq6XWmZ" +
                                "nOcFMQTE+wJaI6EqTiylrg8CgYAIyDy9vZzvgiDSnUz7ithJLiCtFdgqU0VoCdfg" +
                                "OCWkQcbXADm29GqvoGF0WwevcXm0oqpdyiWxp8/5W5qOmvKOKM7aFvFcfa+b23D5" +
                                "vJ4SJrf9S4rdmpaHk+eJFna3Cgu0EDN6S2VZSBFGiOnrUF6pjm+so6vuUXaw3R5k" +
                                "wbCNdwKBgDl6bl8bvZyKHWOUR6x9ZtVEzIugvtXImicuhem+iPuJ5MXKXPc2Ng/n" +
                                "sCX2oIJiMYEFgcrzEk10CZ915kwbPXorpiX7+JLqyCE/6QbTFf7jf1uaxKbatQNk" +
                                "uZHE7gKYMmTF+FMqqQ5gluPHhVmum5fGqSL7pVbGX1kbWYnmJGmz";

			var content = fs.readFileSync('test/conf/server/application.priv', "utf8");
		        var cleaned = CryptoUtil.stripPEMString(content.toString());

			assert(clean == cleaned);
		})
	 })
});

describe("CryptoUtil", function() {
	describe("#decode", function() {
		it("Should decode base64 string into ascii.", function() {
			var encodedStr = "Zm9vYmFy";
			assert("foobar" == CryptoUtil.decode(encodedStr));
		    })
	})
});


describe("CryptoUtil", function() {
	describe("#der", function() {
		it("Should strip the PEM string, and then decode the base64 encoded string", function() {
			var input = "-----BEGIN RSA PRIVATE KEY-----\n" +
			             "MTk=\n" +
			             "-----END RSA PRIVATE KEY-----\n";
			assert(19 == CryptoUtil.der(input));
		    })
	    })
});
