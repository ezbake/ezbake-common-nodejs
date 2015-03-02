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

var express = require('express');
var app = express();
var EzConfiguration = require('ezConfiguration');
var EzBakeSecurity = require('../..');

// Load the EzConfiguration and create a security client
var ezConfig = new EzConfiguration.EzConfiguration(new EzConfiguration.loaders.DirectoryConfigurationLoader("config"));
var securityClient = new EzBakeSecurity.Client(ezConfig);

// set the headers
app.use(function(req, res, next) {
    req.headers[EzBakeSecurity.Constant.headers.USER_DN] = "CN=EzbakeClient, OU=42six, O=CSC, C=US"
    req.headers[EzBakeSecurity.Constant.headers.DN_EXPIRES] = (Date.now()+1000).toString();
    req.headers[EzBakeSecurity.Constant.headers.DN_SIGNATURE] = ""
    next();
});

// get the token
app.use(function(req, res, next) {
    securityClient.fetchTokenForProxiedUser(req, function(err, token) {
        if (err) {
            res.send(403, "unauthorized");
        }
        req.ezSecurityToken = token;
        next();
    });
});

app.get('/token', function(req, res){
      res.send(req.ezSecurityToken);
});

var server = app.listen(3000, function() {
        console.log('Listening on port %d', server.address().port);
});

