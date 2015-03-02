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
 */
	
var rsaKeyCrypto = require("../crypto/rsaKeyCrypto.js");
var thrift = require("thrift");

var ezbakeBaseTypes = require("../thrift/ezbakeBaseTypes_types.js");

var TokenResponse = ezbakeBaseTypes.TokenResponse; 

var EzSecurityToken = ezbakeBaseTypes.EzSecurityToken;
var NEzSecurityToken = ezbakeBaseTypes.EzSecurityToken;

var Int64 = require("node-int64");
var fs = require("fs");


function EzbakeSecurityUtil() {

}

EzbakeSecurityUtil.verify = function(publicKey, data, signature) {
    var verifies = false;

    try {
	
	var crypto = new RSAKeyCrypto(publicKey, false);
	verifies = crypto.verify(data, signature);
	}
    catch(err) {
	console.log("Error: " + err);
    }
    return verifies;
}

EzbakeSecurityUtil.verifySignedNewResponse = function(publicKey, token, cbk) {
    
    var sData = EzbakeSecurityUtil.serializeTokenResponse(token.response);
    //console.log("Data: " + sData);

    var fh = fs.createWriteStream("data.out");
    fh.write(sData);
    fh.end();

    var verifies = EzbakeSecurityUtil.verify(publicKey, sData, token.signature);
    console.log('verifySignedResponse - signature verified: ' + verifies);

    if(cbk != null) {
	cbk(null, verifies);
    }
    
    return verifies;
    
}

EzbakeSecurityUtil.verifyReceivedToken = function(publicKey, token, securityId, cbk) {
    var verifies = false;
    try {
        //token.validate();
        //if(token.response.targetSecurityId == null) {
        //throw "In this case, optional field 'sendToApp' is considered required";
            //}

        //if(token.response.targetSecurityId == id) {
            if(token.response.expires > Date.now()) {
                console.log("verifyReceivedToken - date check passed");
                verifies = EzbakeSecurityUtil.verifySignedLegacyResponse(publicKey, token, cbk);
            }
            // }
    }
    catch(err) {
        throw err;
    }
    return verifies;
}



/**
 * Description - Copies a new NEzSecurityToken into an old
 * token format.
 * @Param tok - Is a new NEzSecurityToken
 * @return a copy of the token using old token format.
 */
EzbakeSecurityUtil.copyToken = function(tok) {
    var copyTok = new EzSecurityToken();
    copyTok.signature = tok.tSignature;
    copyTok.response = copyTokenResponse(tok.response);

    return copyTok;
}

function copyTokenResponse(resp) {
    var copyResp = new TokenResponse();
    copyResp.securityId = resp.securityId;
    copyResp.targetSecurityId = resp.targetSecurityId;
    copyResp.expires = resp.expires;
    copyResp.securityInfo = copySecurityInfo(resp.securityInfo);
    
    return copyResp;
}

function copySecurityInfo(sinfo) {
    var copySInfo = new SecurityInfo();
    copySInfo.userInfo = copyUserInfo(sinfo.userInfo);
    copySInfo.appInfo = copyAppInfo(sinfo.appInfo);

    if(sinfo.auths != null) {
	copySInfo.auths = cloneArray(sinfo.auths);
    }

    if(sinfo != null) {
	copySInfo.projects = cloneMap(sinfo.projects);
    }

    copySInfo.clearanceInfo = copyClearanceInfo(sinfo.clearanceInfo);
    copySInfo.communityAttributes = copyCommunityAttributes(sinfo.communityAttributes);
    
    return copySInfo;
}

function copyCommunityAttributes(cainfo) {
    var copyCaInfo = null;

    if(cainfo != null) {
	copyCaInfo = new CommunityAttr();
	copyCaInfo.communityType = cainfo.communityType;
	copyCaInfo.organization = cainfo.organization;
	if(cainfo.topics != null) {
	    copyCaInfo.topics = cloneArray(cainfo.topics);
	}

	if(cainfo.regions != null) {
	    copyCaInfo.regions = cloneArray(cainfo.regions);
	}
	
	if(cainfo.groups != null) {
	    copyCaInfo.groups = cloneArray(cainfo.groups);
	}
	copyCaInfo.isAICP = cainfo.isAICP;
    }

    return copyCaInfo;

}

function copyClearanceInfo(cinfo) {
    var copyCInfo = new ClearanceInfo();
    copyCInfo.clearance = cinfo.clearance;
    copyCInfo.formalAccess = cloneArray(cinfo.formalAccess);
    copyCInfo.citizenship = cinfo.citizenship;
    copyCInfo.organization = cinfo.organization;
    return copyCInfo;
}


function copyUserInfo(uinfo) {
    var copyUInfo = null;

    if(uinfo != null) {
	copyUInfo = new UserInfo();
	copyUInfo.id = uinfo.id;
	copyUInfo.dn = uinfo.dn;
	copyUInfo.name = uinfo.name;
    }

    return copyUInfo;
    
}


function copyAppInfo(ainfo) {
    var copyAInfo = null;
    if(ainfo != null) {
	copyAInfo = new AppInfo();
	copyAInfo.securityId = ainfo.securityId;
    }

    return copyAInfo;
}


function cloneArray(list) {
    newList = [];
    for(var x in list) {
	newList.push(list[x]);
    }
    return newList;
}

function cloneMap(map) {
    return JSON.parse(JSON.stringify(map));
}



module.exports = EzbakeSecurityUtil;
