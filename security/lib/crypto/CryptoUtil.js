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
 * @date 01/13/2014
 * Description: Crypto Util
 */

function CryptoUtil() {
}


CryptoUtil.stripPEMString = function(pem) {
    var cleanKey = pem;
    
    if(pem.indexOf("-----BEGIN") >= 0) {
	cleanKey = "";
	lines = pem.split("\n");
	for(var i = 1; i < lines.length-1; i++) {
	    if(lines[i].indexOf("-----END") >= 0)
		break;
	    cleanKey += lines[i];
	}
    }

    cleanKey = cleanKey.replace(/\s/g, "");
    
    return cleanKey;
}

/**
 * 
 */
CryptoUtil.encode = function(data) {
    return new Buffer(new Buffer(data).toString("base64"));
}

CryptoUtil.decode = function(encoded) {
    return new Buffer(encoded, "base64");
}

CryptoUtil.der = function(pem) {
    return CryptoUtil.decode(CryptoUtil.stripPEMString(pem));
}


module.exports = CryptoUtil;